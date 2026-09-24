# Finder module

Pure JavaScript (ES module, no dependencies). Works in Node 20+ and in browsers.

```
node --test          # runs finder.test.mjs (10 tests, including 80 golden runs of the prototype)
```

Usage:

```js
import { createFinder, QUESTIONS } from './finder.mjs';

const finder = createFinder(tools);          // tools: see the FinderTool typedef at the top of finder.mjs
let state = finder.start();
let id = finder.nextQuestion(state);          // 'goal', 'unsure', 'need', or an adaptive id; null when done
const options = finder.optsFor(id, state.A);  // [[label, value], ...]
state = finder.answer(state, id, options[0][1]);
// ... repeat until nextQuestion(state) === null, then:
const result = finder.results(state);         // { picks, alternatives, exactCategoryCount, questionsAsked, stoppedEarly, note, ... }
```

The "Back" button is the caller's job: keep a stack of previous `state` objects (states are plain objects and `answer` never mutates).

Convert to TypeScript if you like. Keep the behavior and keep the tests passing.

`fixtures/tools.json` holds the 42 sample tools used by the tests. The tests assert results for the sample data, so with the real database keep a copy of this fixture for the tests.
