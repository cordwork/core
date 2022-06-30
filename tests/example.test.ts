import { fail, success } from '../src/';

describe('📌 Function Check', () => {
	it('Success', () => success() === true);
	it('Fail', () => {
		try {
			fail();
			return false;
		} catch ( err ) {
			err.message('Something failed');
		}
	});
});
