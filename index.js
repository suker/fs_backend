const PORT = 3001;
let express = require('express');
let app = express();

const persons = [
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
    return response.json(persons)
})

app.listen(PORT);
