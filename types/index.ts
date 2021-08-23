export type QueueMetrics = {
  replay_id: number;
  event_type: string;
  enqueue_time: string;
  dequeue_time: string;
  queue_name: string;
};

export type QueueData = {
  replay_id: number;
  event_type: string;
  enqueue_time: Date;
  dequeue_time: Date;
  queue_name: string;
};
