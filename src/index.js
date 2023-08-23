import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
const port = 8080

const users = [];


// Função para listar os usuários: 

app.get("/", (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({
            mensagem: "Nenhum usuário encontrado!"
        })
    }

    res.json(users)
})


// Função para criar novos usuários: 

app.post("/newuser", (req, res) => {
    const { name, email, password } = req.body;


    if (!name) {
        return res.status(404).json({
            mensagem: "O nome deve ser informado!"
        })
    }
    if (!password) {
        return res.status(404).json({
            mensagem: "A senha deve ser informada!"
        })
    }
    if (!email) {
        return res.status(404).json({
            mensagem: "O e-mail deve ser informado!"
        })
    }


    const findEmail = users.find(user => user.email === email);

    if (findEmail) {
        return res.status(404).json({
            mensagem: `Esse e-mail já foi cadastrado por outro usuário, por favor, use outro e-mail.`
        })
    }

    const user = {
        id: uuidv4(),
        name,
        email,
        password,
        messages: []

    }

    users.push(user)

    res.status(201).json({
        message: `Usuário ${user.name} cadastrado com sucesso!`,
        data: user
    })

});


// Função para realizar login:

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(404).json({
            message: "O e-mail deve ser informado!"
        })
    }
    if (!password) {
        return res.status(404).json({
            message: "A senha deve ser informada!"
        })
    }


    const findUser = users.find(user => user.email === email);

    if (!findUser) {
        return res.status(404).json({
            message: "Usuário não localizado!"
        })
    }

    if (password !== findUser.password) {
        return res.status(404).json({
            message: "Senha incorreta!"
        })
    }


    res.status(201).json({
        message: `Seja bem vindo ${findUser.name}`
    });

});


// Atualizar usuário:

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name: newName } = req.body;

    const user = users.find(user => user.id == id);

    if (!user) {
        return res.status(404).json({
            mensagem: `Usuário não encontrado!`
        })
    }

    user.name = newName;

    res.status(201).json({
        message: `Usuário ${user.name} atualizado com sucesso!`
    });

});


// Deletar usuário:

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    const userIndex = users.findIndex(user => user.id == id);

    if (userIndex === -1) {
        return res.status(404).json({
            mensagem: `Usuário não encontrado!`
        })
    }

    const deleteUser = users.splice(userIndex, 1)

    res.status(200).json({
        message: `Usuário deletado com sucesso!`,
        user: deleteUser
    })

});


///////      ----------- Parte dos recados: -------------   //////


// Função para listar os recados:

app.get("/messages/:id", (req, res) => {
    const { id } = req.params;

    // buscar o usuario
    const user = users.find(user => user.id == id);

    if (!user) {
        return res.status(404).json({
            message: "Usuário não localizado!"
        })
    }

    if (user.messages.length === 0) {
        return res.status(404).json({
            message: 'Nenhum recado encontrado!'
        })
    }

    res.json(user.messages)

})

// Função para criar recados:

app.post("/messages/:id", (req, res) => {
    const { id } = req.params
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "O título do recado deve ser informado!"
        })
    }
    if (!description) {
        return res.status(400).json({
            message: "A descrição do recado deve ser informado!"
        })
    }

    // buscar o usuario
    const user = users.find(user => user.id == id);

    if (!user) {
        return res.status(404).json({
            message: "Usuário não localizado!"
        })
    }

    const repeatTask = user.messages.find(task => task.title === title);
    if (repeatTask) {
        return res.status(400).json({
            message: "Já existe uma tarefa com esse título!"
        })
    }

    const message = { index: uuidv4(), title, description }
    user.messages.push(message)

    res.status(201).json({
        message: `A tarefa ${message.title} cadastrada com sucesso!`
    })

});

// Função para atualizar a tarefa:

app.put("/messages/:id/:index", (req, res) => {
    const { id, index } = req.params;
    const { title: newTitle } = req.body;

    // buscar o usuario

    const user = users.find(user => user.id == id);

    if (!user) {
        return res.status(404).json({
            message: "Usuário não localizado!",

        });
    }

    const messageFind = user.messages.find(message => message.index == index);



    if (!messageFind) {
        return res.status(404).json({
            message: 'Recado não localizado!',
        });
    }

    messageFind.title = newTitle;

    res.status(200).json({
        message: `A tarefa atualizado com sucesso!`
    })



});

// Função para deletar tarefa:

app.delete("/messages/:id/:index", (req, res) => {
    const { id, index } = req.params;

    const user = users.find(user => user.id == id);

    if (!user) {
        return res.status(404).json({
            message: "Usuário não localizado!",

        });
    }

    const findMessage = user.messages.findIndex(message => message.index == index);

    if (findMessage == -1) {
        res.status(404).json({
            message: "Recado não localizado!"
        });
    }

    user.messages.splice(findMessage, 1);
    res.status(200).json({
        message: `Recado deletado com sucesso!`
    })

})

app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`))