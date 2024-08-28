const PORT = 3001;
let express = require('express');
let app = express();

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
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (!person) return response.status(404).end(`Resource with id ${id} not found`)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response)=> {
    const id = request.params.id
    persons = persons.filter(person => person.id === id)
    response.status(204).send()
})

app.get('/info', (request, response) => {
	const persons_info = `<div>Phonebook has info for ${persons.length} people</div><br/>`;
    const time_str = new Date().toString()
	const request_time = `<div>${time_str}</div>`;
    const result = persons_info + request_time

	response.send(result);
});

app.listen(PORT);
