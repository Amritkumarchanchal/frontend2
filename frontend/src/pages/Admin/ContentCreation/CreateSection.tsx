import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoursesWithAuth } from '@/store/slices/courseSlice'
import { CourseDropdown } from '@/components/AdminComponents/AdminUiComponents/CourseDropdown'
import { fetchModulesWithAuth } from '@/store/slices/fetchModulesSlice'
import { ModuleDropdown } from '@/components/AdminComponents/AdminUiComponents/ModuleDropdown'
import { fetchSectionsWithAuth } from '@/store/slices/fetchSections'
import { AdminSectionCreation } from '@/components/AdminComponents/AdminSectionCreation'

const CreateSection = () => {
  const dispatch = useDispatch()
  const courses = useSelector((state) => state.courses.courses ?? [])
  const isLoading = useSelector((state) => state.courses.isLoading ?? true)
  const error = useSelector((state) => state.courses.error ?? null)
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const courseId = selectedCourseId
  const moduleId = selectedModuleId

  // Effect to fetch courses
  useEffect(() => {
    if (!courses.length) {
      dispatch(fetchCoursesWithAuth())
    }
  }, [dispatch, courses.length])

  // Callback function to handle course selection
  const handleCourseSelected = (courseId) => {
    setSelectedCourseId(courseId)
    // Additional logic can be placed here if needed
  }

  const moduleData = useSelector(
    (state) => state.modules?.modules?.[courseId] ?? null
  )

  useEffect(() => {
    if (moduleData === null) {
      dispatch(fetchModulesWithAuth(courseId))
    }
  }, [dispatch, courseId, moduleData])

  const handleModuleSelected = (moduleId) => {
    setSelectedModuleId(moduleId)
  }

  const sections = useSelector(
    (state) => state.sections.sections[selectedModuleId] ?? null
  )

  useEffect(() => {
    if (moduleId && !sections) {
      dispatch(
        fetchSectionsWithAuth({
          courseId: courseId,
          moduleId: moduleId,
        })
      )
    }
  }, [courseId, moduleId, dispatch])

  return (
    <div className='p-6 bg-gray-100 h-full'>
      <div className='mb-6 flex justify-between items-center'>
      <h1 className='text-2xl font-bold text-gray-800'>Manage Sections</h1>
      <AdminSectionCreation />
      </div>
      {isLoading ? (
      <div className='flex justify-center items-center h-40'>
        <p className='text-lg text-gray-600'>Loading...</p>
      </div>
      ) : error ? (
      <div className='flex justify-center items-center h-40'>
        <p className='text-lg text-red-500'>Error: {error}</p>
      </div>
      ) : (
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <div className='mb-4'>
        <p className='text-lg font-medium text-gray-700'>
          Select a course to view its modules:
        </p>
        <CourseDropdown onCourseSelected={handleCourseSelected} />
        </div>
        {selectedCourseId && (
        <div className='mb-4'>
          <p className='text-lg font-medium text-gray-700'>
          Select a module to view its sections:
          </p>
          <ModuleDropdown
          courseId={selectedCourseId}
          onModuleSelected={handleModuleSelected}
          />
        </div>
        )}
        <div>
        <p className='text-lg font-medium text-gray-700'>Sections:</p>
        {sections?.length ? (
          <ul className='list-disc list-inside mt-2 space-y-2'>
          {sections.map((section) => (
            <li
            key={section.id}
            className='text-gray-800 bg-gray-50 p-2 rounded-md shadow-sm'
            >
            {section.title}
            </li>
          ))}
          </ul>
        ) : (
          <p className='text-gray-500 mt-2'>No sections available.</p>
        )}
        </div>
      </div>
      )}
    </div>
  )
}

export default CreateSection
