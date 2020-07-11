function test() {
  return Test.run();
}

class TestRunner {
  static run() {
    return (new this).run();
  }

  run() {
    const startAt = Date.now();
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    const success = [];
    const failed = [];

    for (const method of methods) {
      if (method === 'constructor' || method === 'run') {
        continue;
      }

      try {
        this[method]();
        success.push([method]);
      } catch (e) {
        failed.push([method, e]);
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

class Test extends TestRunner {
  ['It should be ok.']() {
    GSUnit.assert(true);
  }

  ['It should be ng.']() {
    GSUnit.assert(false);
  }
}