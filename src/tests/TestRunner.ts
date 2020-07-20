export class TestRunner {
  static testCases: typeof TestRunner[] = [];
  static register(testCase: typeof TestRunner) {
    this.testCases.push(testCase);
  }

  static run() {
    return (new this).run();
  }

  setup() {
    // This method will be Overwriden by sub class.
  }

  teardown() {
    // This method will be Overwriden by sub class.
  }

  run() {
    const startAt = Date.now();
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    const success = [];
    const failed = [];

    for (const method of methods) {
      if (
        method === 'constructor' ||
        method === 'run' ||
        method === 'setup' ||
        method === 'teardown'
      ) {
        continue;
      }

      try {
        this.setup();
        this[method as keyof TestRunner]();
        success.push([method]);
      } catch (e) {
        failed.push([method, e]);
      } finally {
        this.teardown();
      }
    }

    const endAt = Date.now();

    const messages = [];
    messages.push(`Finished in ${((endAt - startAt) / 1000).toFixed(2)} seconds.`);
    messages.push(`${success.length + failed.length} tests, ${failed.length} failures.`);
    if (failed.length > 0) {
      messages.push('Faild tests are:');
      failed.forEach(([test, error]) => {
        messages.push(`  - ${test}: ${error} ${error.stack || ''}`);
      });

      throw messages.join('\n');
    }

    console.log(messages.join('\n'));

    return messages.join('\n');
  }
}

export function test() {
  return TestRunner.testCases.map((testCase) => testCase.run()).join('\n');
}