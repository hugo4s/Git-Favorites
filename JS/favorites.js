export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(data => {

            return {
                login: data.login,
                name: data.name,
                public_repos: data.public_repos,
                followers: data.followers
            }
        })
    }
}

export class Favorites { 
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }
    load() {
         this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

        const userExists = this.entries.find(entry => entry.login === username)
        
        if(userExists) {
            throw new Error('Usuário já cadastrado')
        }

        const user = await GithubUser.search(username)

        if(user.login === undefined) {
            throw new Error("Usuário não encontrado")
        }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()

        } catch(error) {
            alert(error.message)
        }
}

    delete(user) {
        const filteredEntries = this.entries.
        filter(entry => entry.login !== user.login)
            console.log("chegou")
             this.entries = filteredEntries
             this.update()
             this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody');
    
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.butao')
       
        addButton.onclick = () => {
            const { value } = this.root.querySelector('header input')
            this.add(value)
        }
    }
    update() {
       this.removeAllTr()
    
    this.entries.forEach(user => {
       const row = this.createRow()
    
       row.querySelector('.user img').src = `https://github.com/${user.login}.png`
       row.querySelector('.user a').href = `https://github.com/${user.login}`
       row.querySelector('.user p').textContent = user.name
       row.querySelector('.user span').textContent = user.login
       row.querySelector('.Repositories').textContent = user.public_repos
       row.querySelector('.Followers').textContent = user.followers

       row.querySelector('#remover').onclick = () => {const isOk = confirm('Tens a certeza que queres remover dos favoritos?')
        if(isOk){
            this.delete(user)
        }
       }
    
       this.tbody.append(row)
    })
    }
    
    createRow() {
        
        const tr = document.createElement('tr')
    
        const content = `
        <td class="user">
            <img class= "imagem" src="https://github.com/maykbrito.png" alt="img github">
            <a href="https://github.com/maykbrito">
                <p>Mayk Brito</p>
                <span>/maykbrito</span>
            </a>
        </td>
        <td class="Repositories">123</td>
        <td class="Followers">1234</td>
        <td> <button id="remover">Remover</button></td>
        `
        tr.innerHTML = content
    
        return tr
    }
    
    removeAllTr() {
       this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove());
    }
}

