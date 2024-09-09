require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Contact = require('./models/Contact');

const PORT = process.env.PORT || 3001;
console.log(`Server Running on port ${PORT}`);

// MIDDLEWARES

// use for static files of /dist dir
app.use(express.static('dist'));

app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (request, response) => {
	return response.send('Hello world!');
});

app.get('/api/persons', (request, response) => {
	Contact.find({}).then((contacts) => {
		response.json(contacts);
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Contact.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).send({ error: 'id not found in db' });
			}
		})
		.catch((err) => next(err));
});

const generateId = () => {
	const maxId =
		persons.length > 0
			? Math.max(...persons.map((person) => Number(person.id)))
			: 0;
	return String(maxId + 1);
};

app.post('/api/persons', (request, response, next) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({ error: 'content missing' });
	}

	const contact = new Contact({
		// id: generateId(),
		name: body.name.trim(),
		number: body.number,
	});

	contact.save().then((savedContact) => {
		response.json(savedContact);
	});
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Contact.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	Contact.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((err) => next(err));
});

app.get('/info', (request, response, next) => {
	Contact.find({})
		.then((data) => {
			const persons_info = `<div>Phonebook has info for ${data.length} people</div><br/>`;
			const time_str = new Date().toString();
			const request_time = `<div>${time_str}</div>`;
			const result = persons_info + request_time;
			response.send(result);
		})
		.catch((err) => next(err));
	
});

app.listen(PORT);

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// ERROR HANDLING MIDDLEWARE (must be last one)

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);
