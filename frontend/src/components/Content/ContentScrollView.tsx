import React, { useEffect, useState } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { useLocation } from 'react-router-dom'
import {
  useFetchItemsWithAuthQuery,
  useFetchQuestionsWithAuthQuery,
} from '@/store/ApiServices/LmsEngine/DataFetchApiServices'
import {
  useStartAssessmentMutation,
  useSubmitAssessmentMutation,
} from '@/store/ApiServices/ActivityEngine/GradingApiServices'
import { useUpdateSectionItemProgressMutation } from '@/store/ApiServices/ActivityEngine/UpdatingApiServices'
import { useDispatch } from 'react-redux'
import { setStreak } from '@/store/slices/streakSlice'
import { toast } from 'sonner'
import VideoPlayer from './VideoPlayer'
import AssessmentViewer from './AssessmentViewer'
import ArticleViewer from './ArticleViewer'
import ContentNavigation from './ContentNavigation'
import ProctoringWrapper from './ProctoringWrapper'

const ContentScrollView = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { assignment, sectionId, courseId } = location.state || {}
  const [currentFrame, setCurrentFrame] = useState(
    assignment?.sequence ? assignment.sequence - 1 : 0
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [assessmentId, setAssessmentId] = useState(null)
  const [responseData, setResponseData] = useState(null)

  const { data: assignmentsData } = useFetchItemsWithAuthQuery(sectionId)
  const content = assignmentsData || []
  const { data: assessmentData, refetch } =
    useFetchQuestionsWithAuthQuery(assessmentId)
  const [startAssessment] = useStartAssessmentMutation()
  const [submitAssessment] = useSubmitAssessmentMutation()
  const [updateSectionItemProgress] = useUpdateSectionItemProgressMutation()

  useEffect(() => {
    if (content[currentFrame]?.item_type === 'Assessment') {
      setCountdown(30)
      const timer = setInterval(() => {
        setCountdown((prev) =>
          prev <= 1
            ? (setCurrentFrame((f) => (f - 1) % content.length), 30)
            : prev - 1
        )
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentFrame, content])

  const fetchAssessment = (frameIndex) => {
    if (content[frameIndex + 1]?.item_type === 'Assessment') {
      setAssessmentId(content[frameIndex + 1].id)
      startAssessment({
        courseInstanceId: courseId,
        assessmentId: content[frameIndex + 1].id,
      })
        .then((res) => setResponseData(res.data.attemptId))
        .catch(() => toast('Failed to start assessment', { type: 'error' }))
    }
  }

  const handleNextFrame = () => {
    setCurrentFrame((prev) => (prev + 1) % content.length)
    fetchAssessment(currentFrame)
  }

  const handleSubmitAssessment = (selectedOption) => {
    submitAssessment({
      assessmentId,
      sectionId,
      courseId,
      attemptId: responseData,
      questionId: assessmentData[0].id,
      answers: selectedOption,
    }).then((res) => {
      if (res.data.isAnswerCorrect) {
        updateSectionItemProgress({
          courseInstanceId: courseId,
          sectionItemId: [
            content[currentFrame - 1].id,
            content[currentFrame].id,
          ],
          cascade: true,
        })
        handleNextFrame()
      } else {
        setCurrentFrame((prev) => (prev - 1) % content.length)
        toast('Incorrect Answer! Replaying segment.')
      }
      dispatch(setStreak(res.data.currentStreak))
    })
  }

  const renderContent = () => {
    console.log('currentFrame', content)
    const frame = content[currentFrame]
    console.log('frame', frame)
    switch (frame?.item_type) {
      case 'Video':
        return (
          <VideoPlayer
            frame={frame}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onNextFrame={handleNextFrame}
          />
        )
      case 'Assessment':
        return (
          <AssessmentViewer
            assessmentData={assessmentData}
            onSubmit={handleSubmitAssessment}
            onPrevFrame={() => setCurrentFrame((prev) => prev - 1)}
            countdown={countdown}
          />
        )
      case 'article':
        return (
          <ArticleViewer
            content={frame.content}
            onNextFrame={handleNextFrame}
          />
        )
      default:
        return <p>No content available</p>
    }
  }

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel defaultSize={95}>
        <ProctoringWrapper>
          <ResizablePanelGroup direction='vertical'>
            <ResizablePanel defaultSize={90}>{renderContent()}</ResizablePanel>
            <ResizableHandle />
            {content[currentFrame]?.item_type === 'Video' && (
              <ResizablePanel defaultSize={10} />
            )}
          </ResizablePanelGroup>
        </ProctoringWrapper>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={5}>
        <ContentNavigation
          currentFrame={currentFrame}
          totalFrames={content.length}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ContentScrollView
