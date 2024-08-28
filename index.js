const express = require('express');
const morgan = require('morgan')

const PORT = 3001;
console.log(`Server Running on port ${PORT}`)
const app = express();

app.use(express.json());
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ')
  }))

let persons = [
	{
		id: '1',
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: '2',
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: '3',
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: '4',
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/', (request, response) => {
	return response.send('Hello world!');
});

app.get('/api/persons', (request, response) => {
	return response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);

	if (!person)
		return response.status(404).end(`Resource with id ${id} not found`);

	response.json(person);
});

const generateId = () => {
	const maxId =
		persons.length > 0
			? Math.max(...persons.map((person) => Number(person.id)))
			: 0;
	return String(maxId + 1);
};

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({ error: 'content missing' });
	}

	const repeatedPerson = persons.find(
		(person) => person.name.toLowerCase() === body.name.toLowerCase()
	);

	if (repeatedPerson)
		return response.status(400).json({ error: 'name must be unique' });

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);
	response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id === id);
	response.status(204).send();
});

app.get('/info', (request, response) => {
	const persons_info = `<div>Phonebook has info for ${persons.length} people</div><br/>`;
	const time_str = new Date().toString();
	const request_time = `<div>${time_str}</div>`;
	const result = persons_info + request_time;

	response.send(result);
});

app.listen(PORT);
