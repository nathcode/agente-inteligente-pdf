const test = require('node:test');
const assert = require('node:assert/strict');

process.env.LLM_PROVIDER = 'ollama';
process.env.OLLAMA_BASE_URL = 'http://localhost:11434';

const openaiService = require('../src/services/openai.service');

test('ollama provider stores and returns messages for a thread', async () => {
  const thread = await openaiService.createThread();
  assert.ok(thread.id, 'debería crear un identificador de hilo');

  await openaiService.addMessage(thread.id, 'Hola desde Ollama');
  const messages = await openaiService.getMessages(thread.id);

  assert.equal(messages.data[0].role, 'user');
  assert.match(messages.data[0].content[0].text.value, /Hola desde Ollama/);
});
