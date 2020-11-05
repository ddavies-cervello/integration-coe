export const data = {
  eventType: "PE Name",
  Queues: [
    {
      //volume, and throughput metrics
      queueId: 1,
      queueName: "queue-1",
      avrgTimeInQueue: 6,
      avrgDequeuesInHour: 59,
      avrgEnqueuesInHour: 57,
      totalEnqueuesin24hrs: 3420,
    },
    {
      //will have multiple queues
      queueId: 2,
      queueName: "queue-2",
      avrgTimeInQueue: 8,
      avrgDequeuesInHour: 58,
      avrgEnqueuesInHour: 51,
      totalEnqueuesin24hrs: 3060,
    },
  ],
};
//react.js should expose and endpoint for recieving data
//can react.js pull data too
//Want to be able to compare which queue processes the fastest
//Eventually want to also incorporate error handling and suchioo
