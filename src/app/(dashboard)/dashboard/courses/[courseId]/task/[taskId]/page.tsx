// server component (no hooks aquí)
import { use } from 'react';
import TaskRolePanelBridge from '@/components/course/task/TaskRolePanelBridge';

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ courseId: string; taskId: string }>;
}) {
  const { courseId, taskId } = use(params);

  return (
    <div className="space-y-5">
      <TaskRolePanelBridge courseId={courseId} taskId={taskId} />
    </div>
  );
}
