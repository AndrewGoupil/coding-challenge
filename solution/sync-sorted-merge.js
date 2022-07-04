"use strict";

// Print all entries, across all of the sources, in chronological order.
module.exports = (logSources, printer) => {

  // General Idea:
  // The problem requires some sort of Priority Queue, based on chronological Log timestamps
  //  A standard implementation of this is using a MinHeap
  // Since JS does not have Heap datastructure natively, we can recreate this behaviour using array-based heaps

  // Runtime:
  //  Space Complexity: 0(N)
  //    We only ever store up to N  (# of sources) logs inside the the (taking advantage of the fact that the sources as sorted chonologically)
  //  Time Complexity: 0(N)
  //    Iterate over the N sources to build our initial MinHeap, the proceed to printing the logs
  //    After each log is printed and removed from the queue, we must maintain the min heap (0(logN))
  //    Which as a whole would be O(N + logN) = 0(N)

  // NOTE: As increase the source it seems the heap occasionally has bugs in always getting the minimum value
  // I tried to limit myself to a max of 2 hours, to not invest to much time on debugging
  // I realize I could have used a library for the heap implementation, but wanted to give the implementation 
  // a go to demonstrate my understanding for what is happening under the hood

  //Bubble down the newly added value, ensuring the minumum value is at index 0 of the array
  function minHeapify(root) {
    let leftChild = 2 * root + 1
    let rightChild = 2 * root + 2
    let min = root;

    // Check the right and left child, and if time value is less than the current minimum
    if ((leftChild < minHeap.length) && minHeap[leftChild].log.date.getTime() <= minHeap[min].log.date.getTime()) {
      min = leftChild;
    }
    if ((rightChild < minHeap.length) && minHeap[rightChild].log.date.getTime() <= minHeap[min].log.date.getTime()) {
      min = rightChild;
    }
    
    // If the root of the array is not the smallest value, bubble LogEntry down the MinHeap
    // Continue to bubbleDown the LogEntry from the LogEntry that go bubbledUp in the array 
    if (min !== root) {
      var temp = minHeap[root];
      minHeap[root] = minHeap[min];
      minHeap[min] = temp;  
      minHeapify(min);
    }
  } 

  let minHeap = []

  // Go through each log source pop a LogEntry, knowing that it is the smallest from the LogSource, add it 
  logSources.forEach((source, index) => {
    minHeap.unshift({log: source.pop(), logSourceIndex: index});
    // Ensure the smallest timestamp is always at 0 index position of our MinHeap
    minHeapify(0);
  });

  while (minHeap.length > 0) {
    // Continuously grab the first element of the PriorityQueue, and print that element next
    let minLogEntry = minHeap.shift();
    printer.print(minLogEntry.log);

    // If the LogSource that we grabbed a log from has a next item, add this to our PriorityQueue
    let newEntry  = logSources[minLogEntry.logSourceIndex].pop();
    if (newEntry) {
      minHeap.unshift({log: newEntry, logSourceIndex: minLogEntry.logSourceIndex});
    }

    // Whether we added a new item, or just removed the top of our heap, we need to ensure the smallest
    // log timestamp is still at the top
    minHeapify(0);
  }

  console.log("Sync sort complete.");
  printer.done();
};
