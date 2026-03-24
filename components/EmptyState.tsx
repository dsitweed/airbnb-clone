import { NotepadText } from 'lucide-react';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface EmptyStateProps {
  title: string;
  subTitle: string;
  refreshAction: () => void;
}

export default function EmptyState({
  title = 'No data found',
  subTitle = 'There are no results to display. Try adjusting your filters or check back later.',
}: EmptyStateProps) {
  return (
    <Card className="w-140">
      <CardHeader>
        <CardTitle className="flex justify-center">
          <NotepadText size={40} />
        </CardTitle>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="flex justify-center">
          <p className="max-w-sm text-center">{subTitle}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button variant="outline">Refresh</Button>
      </CardContent>
    </Card>
  );
}
