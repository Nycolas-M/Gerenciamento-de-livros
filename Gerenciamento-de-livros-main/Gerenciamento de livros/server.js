js


(async ()=>{
const pool = mysql.createPool({host:'localhost',user:'root',password:'sua_senha',database:'book_manager'});


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


// Middleware para verificar token
function auth(role){
return (req,res,next)=>{
const token = req.headers['authorization']?.split(' ')[1];
if(!token) return res.status(401).json({error:'Token ausente'});
try{
const decoded = jwt.verify(token,SECRET);
if(role && decoded.role !== role) return res.status(403).json({error:'Acesso negado'});
req.user = decoded; next();
}catch(e){res.status(401).json({error:'Token inválido'});}
}
}


// Login
app.post('/api/login', async (req,res)=>{
const {username,password} = req.body;
const [users] = await pool.query('SELECT * FROM users WHERE username=?',[username]);
if(!users.length) return res.status(401).json({error:'Usuário não encontrado'});
const user = users[0];
if(await bcrypt.compare(password,user.password_hash)){
const token = jwt.sign({id:user.id,role:user.role},SECRET,{expiresIn:'2h'});
res.json({token,role:user.role});
}else res.status(401).json({error:'Senha incorreta'});
});


// CRUD de livros
app.get('/api/books', auth(), async (req,res)=>{
const [rows] = await pool.query(`SELECT b.id,b.title,a.name as author,b.isbn,b.publisher,b.year,b.copies,b.genre FROM books b JOIN authors a ON a.id=b.author_id`);
res.json(rows);
});


app.post('/api/books', auth('admin'), async (req,res)=>{
const {title,author,isbn,publisher,year,copies,genre} = req.body;
const [a] = await pool.query('SELECT id FROM authors WHERE name=?',[author]);
let author_id = a.length ? a[0].id : (await pool.query('INSERT INTO authors (name) VALUES (?)',[author]))[0].insertId;
const [r] = await pool.query('INSERT INTO books (title,author_id,isbn,publisher,year,copies,genre) VALUES (?,?,?,?,?,?,?)',[title,author_id,isbn,publisher,year,copies,genre]);
res.json({id:r.insertId});
});


app.delete('/api/books/:id', auth('admin'), async (req,res)=>{
await pool.query('DELETE FROM books WHERE id=?',[req.params.id]);
res.json({ok:true});
});


const port = 3000;
app.listen(port,()=>console.log('Servidor rodando na porta',port));
})();