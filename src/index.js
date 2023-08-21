import express from 'express';

const app = express();
app.use(express.json());
const port = 8080

const users = []

// função para listar os usuários: 

app.get("/", (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({
            mensagem: "Nenhum usuário encontrado!"
        })
    }

    res.json(users)
})


// função para criar usuários: 

app.post("/newuser", (req, res) => {
    const { name, email, senha } = req.body;

    if (!name) {
        return res.status(404).json({
            mensagem: "O nome deve ser informado!"
        })
    }
    if (!senha) {
        return res.status(404).json({
            mensagem: "A senha deve ser informada!"
        })
    }
    if (!email) {
        return res.status(404).json({
            mensagem: "O e-mail deve ser informado!"
        })
    }

    const findName = users.find(user => user.name === name)

    if (findName) {
        return res.status(404).json({
            mensagem: `Esse nome de login já existe, por favor, use outro nome.`
        })
    }

    const findEmail = users.find(user => user.email === email);

    if (findEmail) {
        return res.status(404).json({
            mensagem: `Esse e-mail já está cadastro, por favor, use outro e-mail.`
        })
    }

    const user = {
        id: users.length + 1,
        name,
        email,
        senha,
        tasks: []

    }

    users.push(user)

    res.status(201).json({
        message: `Usuário ${user.name} cadastrado com sucesso!`
    })

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





app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`))