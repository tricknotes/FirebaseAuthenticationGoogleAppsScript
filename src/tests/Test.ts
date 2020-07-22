import GSUnit from 'GSUnit';
import { getAuth } from '../FirebaseAuthentication';
import { TestRunner } from './TestRunner';

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

  ['It creates user by email']() {
    const user = this.auth.createUser({
      email: 'hoge@example.com'
    });

    GSUnit.assertEquals(user.email, 'hoge@example.com');
    GSUnit.assertNotNull(user.localId);
    GSUnit.assertEquals(this.auth.getUserByEmail('hoge@example.com')!.localId, user.localId);
  }

  ['It updates user email']() {
    const user = this.auth.createUser({});

    user.email = 'hoi@example.com';
    const updatedUser = this.auth.updateUser(user);

    GSUnit.assertEquals(updatedUser.email, 'hoi@example.com');
    GSUnit.assertEquals(this.auth.getUsers().length, 1);
  }

  ['It updates user phone number']() {
    const user = this.auth.createUser({
      email: 'hoge@example.com'
    });
    user.phoneNumber = '+81-080-0000-0000';
    this.auth.updateUser(user);

    GSUnit.assertEquals(user.phoneNumber, '+81-080-0000-0000');
    GSUnit.assertNotNull(user.localId);
    GSUnit.assertEquals(this.auth.getUserByPhoneNumber('+81-080-0000-0000')!.localId, user.localId);
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

TestRunner.register(Test);