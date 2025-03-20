import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesWithAuth } from '@/store/slices/courseSlice';
import { CourseDropdown } from '@/components/AdminComponents/AdminUiComponents/CourseDropdown';
import { fetchModulesWithAuth } from '@/store/slices/fetchModulesSlice';
import { AdminModuleCreation } from '@/components/AdminComponents/AdminModuleCreation';

const CreateModule = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses ?? []);
  const isLoading = useSelector((state) => state.courses.isLoading ?? true);
  const error = useSelector((state) => state.courses.error ?? null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const courseId = selectedCourseId;

  // Effect to fetch courses
  useEffect(() => {
    if (!courses.length) {
      dispatch(fetchCoursesWithAuth());
    }
  }, [dispatch, courses.length]);

  // Callback function to handle course selection
  const handleCourseSelected = (courseId) => {
    setSelectedCourseId(courseId);
    // Additional logic can be placed here if needed
  };

  const moduleData = useSelector(
      (state) => state.modules?.modules?.[courseId] ?? null
    )
  
    React.useEffect(() => {
      if (moduleData === null) {
        dispatch(fetchModulesWithAuth(courseId))
      }
    }, [dispatch, courseId, moduleData])

  return (
    <div className='p-6 bg-gray-100 h-full'>
      <div className='mb-6 flex justify-between items-center'>
      <h1 className='text-2xl font-bold text-gray-800'>Manage Modules</h1>
      <AdminModuleCreation />
      </div>
      <div className='bg-white shadow-md rounded-lg p-6'>
      {isLoading ? (
        <div className='flex justify-center items-center'>
        <p className='text-gray-500'>Loading...</p>
        </div>
      ) : error ? (
        <div className='text-center'>
        <p className='text-red-600 font-semibold'>Error: {error}</p>
        </div>
      ) : (
        <div>
        <p className='text-gray-700 mb-4'>Select a course to view its modules:</p>
        <CourseDropdown onCourseSelected={handleCourseSelected} />
        <div className='mt-6'>
          <h2 className='text-lg font-semibold text-gray-800'>Modules:</h2>
          {moduleData?.length > 0 ? (
          <ul className='list-disc list-inside mt-2 space-y-2'>
            {moduleData.map((module) => (
            <li
              key={module.module_id}
              className='p-2 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition'
            >
              <span className='text-gray-800'>{module.title}</span>
            </li>
            ))}
          </ul>
          ) : (
          <p className='text-gray-500 mt-2'>No modules available for this course.</p>
          )}
        </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CreateModule;
