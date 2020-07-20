import GSUnit from 'GSUnit';
import { getAuth } from './FirebaseAuthentication';

export class TestRunner {
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
  return Test.run();
}

export class Test extends TestRunner {
  public auth = getAuth(
    PropertiesService.getScriptProperties().getProperty('email')!,
    PropertiesService.getScriptProperties().getProperty('private_key')!.replace(/\\n/g, '\n'), // Unescape newline.
    PropertiesService.getScriptProperties().getProperty('project_id')!,
  );

  teardown() {
    const users = this.auth.getUsers();
    this.auth.deleteUsers(users.map(({ localId }) => localId), true);
  }

  ['It creates uesr by email']() {
    const user = this.auth.createUser({
      email: 'hoge@example.com'
    });

    GSUnit.assertEquals(user.email, 'hoge@example.com');
    GSUnit.assertNotNull(user.localId);
  }

  ['It updates user email']() {
    const user = this.auth.createUser({});

    user.email = 'hoi@example.com';
    const updatedUser = this.auth.updateUser(user);

    GSUnit.assertEquals(updatedUser.email, 'hoi@example.com');
    GSUnit.assertEquals(this.auth.getUsers().length, 1);
  }

  ['It creates users in batch']() {
    this.auth.createUsers([
      { email: 'hoge@example.com', localId: 'hoge' },
      { email: 'hoi@example.com', localId: 'hoi' }
    ]);

    GSUnit.assertEquals(this.auth.getUsers().length, 2);

    const invalid = this.auth.createUsers([
      { email: 'invalid1@example.com' },
      { email: 'invalid2@example.com' }
    ]);

    GSUnit.assertHashEquals(invalid.error[0], { index: 0, message: 'localId is missing' });
    GSUnit.assertHashEquals(invalid.error[1], { index: 1, message: 'localId is missing' });
    GSUnit.assertEquals(this.auth.getUsers().length, 2);
  }

  ['It deletes user']() {
    const user = this.auth.createUser({});
    console.log(this.auth.deleteUser(user.localId));

    GSUnit.assertEquals(this.auth.getUsers().length, 0);
  }
}