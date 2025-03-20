import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useBulkContentUploadMutation } from '../../store/apiService'
import { CourseDropdown } from '@/components/AdminComponents/AdminUiComponents/CourseDropdown'
import { ModuleDropdown } from '@/components/AdminComponents/AdminUiComponents/ModuleDropdown'
import { SectionDropdown } from '@/components/AdminComponents/AdminUiComponents/SectionDropdown'
import { AdminCourseCreation } from '@/components/AdminComponents/AdminCourseCreation'
import { AdminModuleCreation } from '@/components/AdminComponents/AdminModuleCreation'
import { AdminSectionCreation } from '@/components/AdminComponents/AdminSectionCreation'

const BlukQuestionUpload = () => {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')

  const handleCourseSelected = (courseId) => {
    setSelectedCourseId(courseId)
    // Additional logic can be placed here if needed
  }

  const handleModuleSelected = (moduleId) => {
    setSelectedModuleId(moduleId)
  }

  const handleSectionSelected = (sectionId) => {
    setSelectedSectionId(sectionId)
  }

  const [bulkContentUpload, { isLoading }] = useBulkContentUploadMutation()
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const originalJson = JSON.parse(e.target?.result as string)

          // Transform the data structure
          const transformedJson = {
            sectionId: selectedSectionId,
            data: {},
          }

          // Here assuming we only need to transform the first key "0"
          const key = '0'
          if (originalJson[key]) {
            transformedJson.data[key] = {
              segments: originalJson[key].segments.map((segment, index) => ({
                ...segment,
                sequence: 2 * index + 1, // Sequence for videos: 1, 3, 5, ...
              })),
              questions: originalJson[key].questions.map((question, index) => ({
                ...question,
                sequence: 2 * index + 2, // Sequence for assessments: 2, 4, 6, ...
              })),
            }
          }
          await bulkContentUpload({ content: transformedJson }) // Trigger the mutation to upload
        } catch (error) {
          console.error('Error parsing or transforming JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className='flex items-center justify-center h-full bg-gray-100'>
      <Card className='w-full h-full px-40 py-6 bg-white rounded-lg shadow-md flex flex-col gap-4'>
        <h1 className='text-2xl font-bold text-center'>Bulk Question Upload</h1>
        <div className='flex gap-4'>
          <CourseDropdown onCourseSelected={handleCourseSelected} />
          <AdminCourseCreation />
        </div>
        <div className='flex gap-4'>
          <ModuleDropdown
            courseId={selectedCourseId}
            onModuleSelected={handleModuleSelected}
          />
          <AdminModuleCreation />
        </div>
        <div className='flex gap-4'>
          <SectionDropdown
            courseId={selectedCourseId}
            moduleId={selectedModuleId}
            onSectionSelected={handleSectionSelected}
          />
          <AdminSectionCreation />
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='flex justify-center font-bold'>Upload question json file here</h1>
        <Input
          type='file'
          accept='.json'
          onChange={handleFileSelect}
          className='mb-4'
        />
        </div>
        <button
          className='w-full bg-black text-white rounded-sm p-2'
          onClick={handleUpload}
          disabled={isLoading || !file}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </Card>
    </div>
  )
}

export default BlukQuestionUpload
