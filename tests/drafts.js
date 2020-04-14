import test from 'ava';
import nock from 'nock';
import buttondown from '../dist/main';
buttondown.setApiKey('super-secret-api-key');

nock.disableNetConnect();

const reqheaders = {
  Authorization: 'Token super-secret-api-key'
};
const draftsListPage1 = [
  {
    id: 'draft-id',
    subject: 'draft-subject',
    body: 'draft-body',
    creation_date: '2020-04',
    modification_date: '2020-04'
  }
];

test('drafts.list() - no page - 200', async (t) => {
  nock('https://api.buttondown.email', {reqheaders})
    .get('/v1/drafts')
    .query({
      page: 1
    })
    .reply(200, draftsListPage1);

  t.deepEqual(await buttondown.drafts.list(), draftsListPage1);
});

test('drafts.list() - page 1 - 200', async (t) => {
  nock('https://api.buttondown.email', {
    reqheaders
  })
    .get('/v1/drafts')
    .query({
      page: 1
    })
    .reply(200, draftsListPage1);
  t.deepEqual(await buttondown.drafts.list(1), draftsListPage1);
});

test('drafts.list() - page 2 - 200', async (t) => {
  const draftsListPage2 = [
    {
      id: 'draft-id-page-2',
      subject: 'draft-subject',
      body: 'draft-body',
      creation_date: '2020-04',
      modification_date: '2020-04'
    }
  ];
  nock('https://api.buttondown.email', {
    reqheaders
  })
    .get('/v1/drafts')
    .query({
      page: 2
    })
    .reply(200, draftsListPage2);
  t.deepEqual(await buttondown.drafts.list(2), draftsListPage2);
});

test('drafts.list() - 401 - error', async (t) => {
  nock('https://api.buttondown.email', {
    reqheaders
  })
    .get('/v1/drafts')
    .query({
      page: 1
    })
    .reply(401, draftsListPage1);

  const error = await t.throwsAsync(buttondown.drafts.list);
  t.is(error.message, 'Response code 401 (Unauthorized)');
  t.is(error.url, 'https://api.buttondown.email/v1/drafts');
  t.is(error.method, 'GET');
  t.is(error.payload, undefined);
});

// @todo: tests for 5xx, do them by injecting a Got client with no retries,
// see https://github.com/nock/nock#common-issues
