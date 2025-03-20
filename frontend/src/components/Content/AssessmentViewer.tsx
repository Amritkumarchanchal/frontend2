import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AssessmentViewer = ({ assessmentData, onSubmit, onPrevFrame, countdown }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState([]);

  const handleOptionClick = (option, question) => {
    setSelectedOption((prev) =>
      question.type === 'multi-select'
        ? prev.includes(option) ? prev.filter((id) => id !== option) : [...prev, option]
        : [option]
    );
  };

  const question = assessmentData[currentQuestionIndex];

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <div className="flex justify-between mb-4">
        <Button onClick={onPrevFrame}>Back to Video</Button>
        <span>Time Remaining: <strong className="text-red-500">{countdown} seconds</strong></span>
      </div>
      <h3 className="text-2xl font-bold mb-4">{question.text}</h3>
      <ul className="mb-4">
        {question.options.map((option) => (
          <li key={option} className="mb-2">
            <Button
              onClick={() => handleOptionClick(option, question)}
              className={selectedOption.includes(option) ? 'bg-green-500 text-white' : 'bg-white'}
            >
              {option}
            </Button>
          </li>
        ))}
      </ul>
      <small className="mb-4 text-gray-600">{question.hint}</small>
      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={() => onSubmit(selectedOption)} disabled={!selectedOption.length}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AssessmentViewer;