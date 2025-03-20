import React from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';

const ArticleViewer = ({ content, onNextFrame }) => (
  <div className="flex flex-col h-full">
    <ScrollArea className="flex-1">{content}</ScrollArea>
    <Button onClick={onNextFrame} className="mt-4 self-end">Next Part</Button>
  </div>
);

export default ArticleViewer;