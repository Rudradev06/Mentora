import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  BookOpen, 
  Settings, 
  Video, 
  Eye, 
  Save, 
  Plus, 
  Trash2, 
  Upload,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

// Step Components - Same as CreateCoursePage but for editing
const BasicInfoStep = ({ formData, handleChange, handleArrayChange, addArrayItem, removeArrayItem, validationErrors }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Course Title *
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          validationErrors.title ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Enter an engaging course title"
      />
      {validationErrors.title && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {validationErrors.title}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Course Description *
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          validationErrors.description ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Describe what students will learn and achieve in this course"
      />
      {validationErrors.description && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {validationErrors.description}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            validationErrors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Category</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="marketing">Marketing</option>
          <option value="data-science">Data Science</option>
          <option value="other">Other</option>
        </select>
        {validationErrors.category && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {validationErrors.category}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level *
        </label>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Duration *
      </label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          validationErrors.duration ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="e.g., 4 weeks, 2 months, 10 hours"
      />
      {validationErrors.duration && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {validationErrors.duration}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Course Thumbnail
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="url"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </button>
      </div>
      {formData.thumbnail && (
        <div className="mt-2">
          <img
            src={formData.thumbnail}
            alt="Course thumbnail preview"
            className="w-32 h-20 object-cover rounded-md border"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Prerequisites
      </label>
      <div className="space-y-2">
        {formData.prerequisites.map((prereq, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={prereq}
              onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a prerequisite"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('prerequisites', index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('prerequisites')}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Prerequisite
        </button>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Learning Objectives
      </label>
      <div className="space-y-2">
        {formData.learningObjectives.map((objective, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={objective}
              onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What will students learn?"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('learningObjectives', index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('learningObjectives')}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Learning Objective
        </button>
      </div>
    </div>
  </div>
);

const ContentStep = ({ formData, addLesson, updateLesson, removeLesson, validationErrors }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
      <button
        type="button"
        onClick={addLesson}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Lesson
      </button>
    </div>

    {validationErrors.content && (
      <p className="text-sm text-red-600 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {validationErrors.content}
      </p>
    )}

    <div className="space-y-4">
      {formData.content.map((lesson, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Lesson {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeLesson(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => updateLesson(index, 'title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors[`lesson_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter lesson title"
              />
              {validationErrors[`lesson_${index}_title`] && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors[`lesson_${index}_title`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={lesson.duration}
                onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 15 minutes"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Description *
            </label>
            <textarea
              value={lesson.description}
              onChange={(e) => updateLesson(index, 'description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors[`lesson_${index}_description`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe what this lesson covers"
            />
            {validationErrors[`lesson_${index}_description`] && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors[`lesson_${index}_description`]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={lesson.videoUrl}
              onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/video.mp4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials
            </label>
            <div className="space-y-2">
              {lesson.materials.map((material, materialIndex) => (
                <div key={materialIndex} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={material}
                    onChange={(e) => {
                      const newMaterials = [...lesson.materials];
                      newMaterials[materialIndex] = e.target.value;
                      updateLesson(index, 'materials', newMaterials);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/material.pdf"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newMaterials = lesson.materials.filter((_, i) => i !== materialIndex);
                      updateLesson(index, 'materials', newMaterials);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newMaterials = [...lesson.materials, ''];
                  updateLesson(index, 'materials', newMaterials);
                }}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Material
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {formData.content.length === 0 && (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No lessons added yet</p>
        <button
          type="button"
          onClick={addLesson}
          className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Lesson
        </button>
      </div>
    )}
  </div>
);

const SettingsStep = ({ formData, handleChange, setFormData, validationErrors }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price ($)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            validationErrors.price ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0.00"
        />
        {validationErrors.price && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {validationErrors.price}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Set to 0 for a free course
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="react, javascript, frontend"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate tags with commas
        </p>
      </div>
    </div>

    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Publication Settings</h4>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Publish course immediately
          </label>
        </div>
        
        <p className="text-sm text-gray-500">
          {formData.isPublished 
            ? "Your course will be visible to students immediately after update."
            : "Your course will be saved as a draft. You can publish it later from your dashboard."
          }
        </p>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-blue-900 mb-2">Course Summary</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-blue-700">Lessons:</span>
          <span className="ml-2 font-medium">{formData.content.length}</span>
        </div>
        <div>
          <span className="text-blue-700">Prerequisites:</span>
          <span className="ml-2 font-medium">{formData.prerequisites.length}</span>
        </div>
        <div>
          <span className="text-blue-700">Learning Objectives:</span>
          <span className="ml-2 font-medium">{formData.learningObjectives.length}</span>
        </div>
        <div>
          <span className="text-blue-700">Price:</span>
          <span className="ml-2 font-medium">
            {formData.price === 0 ? 'Free' : `$${formData.price}`}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const PreviewStep = ({ formData }) => (
  <div className="space-y-6">
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {formData.thumbnail && (
        <img
          src={formData.thumbnail}
          alt="Course thumbnail"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {formData.title || "Course Title"}
            </h2>
            <p className="text-gray-600">
              {formData.description || "Course description will appear here"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {formData.price === 0 ? 'Free' : `$${formData.price}`}
            </div>
            <div className={`inline-block px-2 py-1 text-xs rounded-full ${
              formData.level === 'beginner' ? 'bg-green-100 text-green-800' :
              formData.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {formData.level}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold">{formData.duration}</div>
            <div className="text-sm text-gray-500">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{formData.content.length}</div>
            <div className="text-sm text-gray-500">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold capitalize">{formData.category}</div>
            <div className="text-sm text-gray-500">Category</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {formData.isPublished ? 'Published' : 'Draft'}
            </div>
            <div className="text-sm text-gray-500">Status</div>
          </div>
        </div>

        {formData.learningObjectives.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
            <ul className="space-y-2">
              {formData.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {formData.prerequisites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
            <ul className="space-y-2">
              {formData.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-3">Course Content</h3>
          <div className="space-y-3">
            {formData.content.map((lesson, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{lesson.title || `Lesson ${index + 1}`}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {lesson.description || "Lesson description"}
                    </p>
                  </div>
                  {lesson.duration && (
                    <span className="text-sm text-gray-500">{lesson.duration}</span>
                  )}
                </div>
                {lesson.materials.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      {lesson.materials.length} material(s) included
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    duration: "",
    level: "beginner",
    category: "",
    thumbnail: "",
    isPublished: false,
    content: [],
    prerequisites: [],
    learningObjectives: [],
    tags: [],
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: BookOpen, description: "Course details and overview" },
    { id: 2, title: "Content", icon: Video, description: "Edit lessons and materials" },
    { id: 3, title: "Settings", icon: Settings, description: "Pricing and publication" },
    { id: 4, title: "Preview", icon: Eye, description: "Review changes" }
  ];

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setInitialLoading(true);
      const response = await courseAPI.getCourse(id);
      const course = response.data.course;
      
      // Check if user can edit this course
      if (course.instructor._id !== user.id && user.role !== "admin") {
        setError("You don't have permission to edit this course");
        return;
      }

      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || 0,
        duration: course.duration || "",
        level: course.level || "beginner",
        category: course.category || "",
        thumbnail: course.thumbnail || "",
        isPublished: course.isPublished || false,
        content: course.content || [],
        prerequisites: course.prerequisites || [],
        learningObjectives: course.learningObjectives || [],
        tags: course.tags || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, defaultValue = "") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addLesson = () => {
    const newLesson = {
      title: "",
      description: "",
      videoUrl: "",
      materials: [],
      duration: "",
      order: formData.content.length + 1
    };
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newLesson]
    }));
  };

  const updateLesson = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map((lesson, i) => 
        i === index ? { ...lesson, [field]: value } : lesson
      )
    }));
  };

  const removeLesson = (index) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) errors.title = "Course title is required";
        if (!formData.description.trim()) errors.description = "Course description is required";
        if (!formData.category) errors.category = "Category is required";
        if (!formData.duration.trim()) errors.duration = "Duration is required";
        break;
      case 2:
        if (formData.content.length === 0) {
          errors.content = "At least one lesson is required";
        } else {
          formData.content.forEach((lesson, index) => {
            if (!lesson.title.trim()) {
              errors[`lesson_${index}_title`] = "Lesson title is required";
            }
            if (!lesson.description.trim()) {
              errors[`lesson_${index}_description`] = "Lesson description is required";
            }
          });
        }
        break;
      case 3:
        if (formData.price < 0) errors.price = "Price cannot be negative";
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (isDraft = false) => {
    setError("");
    setLoading(true);

    // Validate all steps before submission
    let isValid = true;
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const courseData = {
        ...formData,
        isPublished: !isDraft && formData.isPublished
      };
      
      await courseAPI.updateCourse(id, courseData);
      
      if (isDraft) {
        alert("Course updated and saved as draft!");
      } else {
        alert("Course updated successfully!");
      }
      
      navigate(`/courses/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Course</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    const commonProps = {
      formData,
      handleChange,
      handleArrayChange,
      addArrayItem,
      removeArrayItem,
      validationErrors,
      setFormData
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...commonProps} />;
      case 2:
        return <ContentStep {...commonProps} addLesson={addLesson} updateLesson={updateLesson} removeLesson={removeLesson} />;
      case 3:
        return <SettingsStep {...commonProps} />;
      case 4:
        return <PreviewStep formData={formData} />;
      default:
        return <BasicInfoStep {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Course
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Course</h1>
          <p className="text-gray-600">Update your course content and settings</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 ml-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep === steps.length ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="flex items-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save as Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {loading ? "Updating..." : "Update Course"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;