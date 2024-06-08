import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginRequest } from '../authConfig';

const useSurveyForm = (initialData = null) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const { instance } = useMsal();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setExpirationDate(initialData.expirationDate || '');
      setQuestions(initialData.questions || []);
    }
  }, [initialData]);

  const validQuestionTypes = [
    'textInput',
    'numberInput',
    'checkbox',
    'toggle',
    'multipleChoice',
    'radio',
    'stars',
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const addQuestion = (type) => {
    if (!validQuestionTypes.includes(type)) {
      setErrors((prevErrors) => [
        ...prevErrors,
        {
          msg: 'Ungültiger Fragetyp.',
          path: `questions[${questions.length}].type`,
        },
      ]);
      return;
    }
    setQuestions([
      ...questions,
      {
        type,
        questionText: '',
        options: [],
        required: false,
        order: questions.length + 1,
      },
    ]);
    setDropdownOpen(false);
  };

  const handleInputChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const toggleRequired = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].required = !newQuestions[index].required;
    setQuestions(newQuestions);
  };

  const duplicateQuestion = (index) => {
    const newQuestions = [...questions];
    const duplicatedQuestion = {
      ...newQuestions[index],
      order: questions.length + 1,
    };
    newQuestions.splice(index + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const moveQuestionUp = (index) => {
    if (index === 0) return;
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(index, 1);
    newQuestions.splice(index - 1, 0, movedQuestion);
    setQuestions(newQuestions);
  };

  const moveQuestionDown = (index) => {
    if (index === questions.length - 1) return;
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(index, 1);
    newQuestions.splice(index + 1, 0, movedQuestion);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e, isEdit = false, surveyId = null) => {
    e.preventDefault();

    const newErrors = [];

    if (!title) {
      newErrors.push({ msg: 'Titel ist erforderlich.', path: 'title' });
    }
    if (!expirationDate) {
      newErrors.push({
        msg: 'Ablaufdatum ist erforderlich.',
        path: 'expirationDate',
      });
    }
    questions.forEach((question, index) => {
      if (!question.questionText) {
        newErrors.push({
          msg: 'Fragetext ist erforderlich.',
          path: `questions[${index}].questionText`,
        });
      }
      if (!validQuestionTypes.includes(question.type)) {
        newErrors.push({
          msg: 'Ungültiger Fragetyp.',
          path: `questions[${index}].type`,
        });
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const activeAccount = instance.getActiveAccount();
      if (!activeAccount) {
        throw new Error('No active account! Please log in.');
      }

      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      const accessToken = response.accessToken;

      const createdBy = {
        azureID: activeAccount.homeAccountId,
        name: activeAccount.name,
      };

      const survey = {
        title,
        description,
        expirationDate,
        questions,
        createdBy,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/surveys/${
          isEdit ? surveyId : ''
        }`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(survey),
        }
      );

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      toast.success(
        `Umfrage erfolgreich ${isEdit ? 'bearbeitet' : 'erstellt'}!`
      );
      navigate('/surveys');
    } catch (error) {
      toast.error('Fehler beim Speichern der Umfrage.');
      console.error('Fehler beim Speichern der Umfrage:', error);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    expirationDate,
    setExpirationDate,
    questions,
    setQuestions,
    addQuestion,
    handleInputChange,
    handleOptionChange,
    addOption,
    removeOption,
    handleSubmit,
    dropdownOpen,
    toggleDropdown,
    errors,
    toggleRequired,
    duplicateQuestion,
    deleteQuestion,
    moveQuestionUp,
    moveQuestionDown,
  };
};

export default useSurveyForm;
