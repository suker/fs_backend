require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const app = express();
const Contact = require('./models/Contact')

const PORT = process.env.PORT || 3001
console.log(`Server Running on port ${PORT}`)

// MIDDLEWARES

// use for static files of /dist dir
app.use(express.static('dist'))

app.use(express.json());
app.use(morgan('tiny'))

// let persons = [
// 	{
// 		id: '1',
// 		name: 'Arto Hellas',
// 		number: '040-123456',
// 	},
// 	{
// 		id: '2',
// 		name: 'Ada Lovelace',
// 		number: '39-44-5323523',
// 	},
// 	{
// 		id: '3',
// 		name: 'Dan Abramov',
// 		number: '12-43-234345',
// 	},
// 	{
// 		id: '4',
// 		name: 'Mary Poppendieck',
// 		number: '39-23-6423122',
// 	},
// ];

app.get('/', (request, response) => {
	return response.send('Hello world!');
});

app.get('/api/persons', (request, response) => {
	Contact.find({}).then(contacts => {
		response.json(contacts)
	})
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
