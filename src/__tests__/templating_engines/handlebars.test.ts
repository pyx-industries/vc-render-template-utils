import { HandlebarsTemplatingEngine } from '../../templating_engines';

describe('HandlebarsTemplatingEngine', () => {
  let engine: HandlebarsTemplatingEngine;

  beforeEach(() => {
    engine = new HandlebarsTemplatingEngine();
  });

  it('should populate a simple template correctly', () => {
    const template = 'Hello, {{name}}!';
    const data = { name: 'World' };
    const expected = 'Hello, World!';
    expect(engine.populate(template, data)).toBe(expected);
  });

  it('should handle templates with multiple variables', () => {
    const template = '<p>Name: {{name}}, Age: {{age}}</p>';
    const data = { name: 'Alice', age: 30 };
    const expected = '<p>Name: Alice, Age: 30</p>';
    expect(engine.populate(template, data)).toBe(expected);
  });

  it('should handle empty data object', () => {
    const template = 'This is a {{placeholder}}';
    const data = {};
    const expected = 'This is a '; // Handlebars replaces missing variables with empty string
    expect(engine.populate(template, data)).toBe(expected);
  });

  it('should handle empty template string', () => {
    const template = '';
    const data = { key: 'value' };
    const expected = '';
    expect(engine.populate(template, data)).toBe(expected);
  });

  it('should handle template with no variables', () => {
    const template = 'Just static text.';
    const data = { name: 'Bob' };
    const expected = 'Just static text.';
    expect(engine.populate(template, data)).toBe(expected);
  });

  it('should handle complex data structures (objects/arrays)', () => {
    const template = 'User: {{user.name}}, Email: {{user.email}}';
    const data = { user: { name: 'Charlie', email: 'charlie@example.com' } };
    const expected = 'User: Charlie, Email: charlie@example.com';
    expect(engine.populate(template, data)).toBe(expected);
  });
});
