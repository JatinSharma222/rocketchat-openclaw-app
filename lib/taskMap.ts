export interface TaskMeta {
    userId: string;
    roomId: string;
    timestamp: number;
}

const taskMap = new Map<string, TaskMeta>();

export function storeTask(taskId: string, data: TaskMeta): void {
    taskMap.set(taskId, data);
    console.log(`[TaskMap] Task stored: ${taskId} → room=${data.roomId}, user=${data.userId}`);
}

export function getTask(taskId: string): TaskMeta | undefined {
    return taskMap.get(taskId);
}

export function deleteTask(taskId: string): void {
    taskMap.delete(taskId);
    console.log(`[TaskMap] Task deleted: ${taskId}`);
}

/** expose current size for debugging */
export function taskMapSize(): number {
    return taskMap.size;
}