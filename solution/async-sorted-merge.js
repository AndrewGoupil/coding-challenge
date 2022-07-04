"use strict";

// Print all entries, across all of the *async* sources, in chronological order.
 async function asyncLogPrinter(logSources, printer) {
  
    // General Idea:
    // Exact same approach as the sync solution, while solving for the async bottlenecks
    // Added comments in areas where we solve for this

    const minHeapify = (root) => {
      let leftChild = 2 * root + 1
      let rightChild = 2 * root + 2
      let min = root;
  
      if ((leftChild < minHeap.length) && minHeap[leftChild].log.date.getTime() <= minHeap[min].log.date.getTime()) {
        min = leftChild;
      }
      if ((rightChild < minHeap.length) && minHeap[rightChild].log.date.getTime() <= minHeap[min].log.date.getTime()) {
        min = rightChild;
      }
      
      if (min !== root) {
        var temp = minHeap[root];
        minHeap[root] = minHeap[min];
        minHeap[min] = temp;
        minHeapify(min);
      }
  } 
  let minHeap = []
  
  // We must wait for all the smallest logs from each source to add before we can proceed
  // printing any log values
  await Promise.all(
    logSources.map(async (source, index) => {
      let nextLog = await source.popAsync()
      minHeap.unshift({log: nextLog, logSourceIndex: index});
      minHeapify(0);
    })
  );
  
  while (minHeap.length > 0) {
    let minLogEntry = minHeap.shift();
    printer.print(minLogEntry.log);

    // If there is a next log value in the logSource wait for it to be added before proceeding
    let newEntry  = await logSources[minLogEntry.logSourceIndex].popAsync();
    if (newEntry) {
      minHeap.unshift({log: newEntry, logSourceIndex: minLogEntry.logSourceIndex});
    }
    minHeapify(0);
  }
  
  printer.done();
}

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    (async () => {
      await asyncLogPrinter(logSources, printer);
      resolve(console.log("Async sort complete."));
    })();
  });
};
