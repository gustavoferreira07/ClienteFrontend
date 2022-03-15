import React, {useState,useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import logoCadastro from './assets/register.png';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';


function App() {
  const baseurl='https://localhost:44379/api/cliente';
  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir]= useState(false);
  const [modalEditar, setModalEditar] = useState(false);  
  const [clienteSelecionado, setClienteSelecionado] = useState(
    {
      id:'',
      nome:'',
      sobrenome:'',
      nacionalidade:'',
      cep:'',
      uf:'',
      localidade:'',
      logradouro:'',
      email:'',
      telefone:''
    });

  const [cepSelecionado, setCepSelecionado] = useState({
    uf:'',
    logradouro:'',
    localidade:''
  });

  const selecionarCliente = (cliente, opcao)=>{
    setClienteSelecionado(cliente);
      (opcao==='Editar') &&
        abrirFecharModalEditar();
      
  }

  const clientePut = async()=>{

    await axios.put(baseurl+'/Editar',clienteSelecionado).then(response=>{
      var resposta= response.data;
      var dadosAuxiliar = data;
      
      // data.map(cliente=>{
      //   (cliente.id=== clienteSelecionado.id) &&
      //     console.log('opa');
      //     cliente.nome=resposta.nome,
      //     cliente.logradouro=resposta.logradouro,
      //     cliente.nacionalidade=resposta.nacionalidade,
      //     cliente.cep=resposta.cep,
      //     cliente.uf=resposta.uf,
      //     cliente.email=resposta.email,
      //     cliente.telefone=resposta.telefone
      //   }
      // );
      alert('Registro alterado com sucesso!');
      abrirFecharModalEditar();
      window.location.reload(false);
    }).catch(error=>{
      console.log(error);
    })
  }

  const clienteGet = async ()=>{
   await  axios.get(baseurl+'/ListarTodos').then(response =>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

 const getCep = async()=>{
   console.log(clienteSelecionado?.cep.length);
    if(clienteSelecionado.cep.length < 9) {
      return;
  } else {
    await axios.get(`https://viacep.com.br/ws/${clienteSelecionado.cep.replace('-','')}/json/`).then(response =>{
      setCepSelecionado({
        uf: response.data.uf,
        logradouro: response.data.logradouro,
        localidade: response.data.localidade
      }) 
      
      console.log(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  }

  const clientePost = async()=>{
    await axios.post(baseurl+'/Adicionar', clienteSelecionado).then(response =>{
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
    }).catch(error=>{
      console.log(error);
    })
  }
  



  const abrirFecharModalIncluir=()=>{
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar=()=>{
    setModalEditar(!modalEditar);
  }



    const handleChange=e=>{
      const{name, value}=e.target;
      setClienteSelecionado({
        ...clienteSelecionado,
        [name]:value
      });
    }

  useEffect(()=>{

    clienteGet();
    
  },[])

  return (
    <div className="App">
      <br/>
      <h3>Cadastro de clientes</h3>
      <header className="App-header">
        <button className='btn btn-primary' onClick={()=>abrirFecharModalIncluir()}>Incluir Cliente</button>
      </header>
      <br/>
      <table className='=table table-bordered'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nacionalidade</th>
            <th>Cep</th>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Logradouro</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
            {data.map(cliente=>(
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.nacionalidade}</td>
                <td>{cliente.cep}</td>
                <td>{cliente.uf}</td>
                <td>{cliente.localidade}</td>
                <td>{cliente.logradouro}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone}</td>
                <td>
                  <button className='btn btn-primary' onClick={()=>selecionarCliente(cliente, 'Editar')}>Editar</button> {"  "}
                  <button className='btn btn-danger' onClick={()=>selecionarCliente(cliente, 'Excluir')}>Excluir</button>
                </td>
              </tr>
              
            ))}
        </tbody>
        </table>
        <Modal isOpen={modalIncluir}>
          <ModalHeader>Incluir Clientes</ModalHeader>
          <ModalBody>
          
            <div className='form-group'>
            
              <label>Nome:</label>
              <br/>
              <input type="text" name='nome'  onChange={handleChange} className='form-control'/>
              <label>Sobrenome:</label>
              <br/>
              <input type="text" name='sobrenome' onChange={handleChange} className='form-control'/>
              <label>Nacionalidade:</label>
              <br/>
              <input type="text" name='nacionalidade' onChange={handleChange}  className='form-control'/>
              <label>Cep:</label>
              <br/>
              <input type="text" name='cep' onBlur={()=>getCep()} onChange={handleChange} className='form-control'/>
              <label>Estado:</label>
              <br/>
              <input type="text" name='estado'  readOnly  value={cepSelecionado && cepSelecionado?.uf} onChange={handleChange} className='form-control'/>
              <label>Cidade:</label>
              <br/>
              <input type="text" name='cidade' readOnly value={cepSelecionado && cepSelecionado?.localidade} onChange={handleChange} className='form-control'/>
              <label>Logradouro:</label>
              
              <br/>
              <input type="text" name='logradouro' readOnly value={cepSelecionado && cepSelecionado?.logradouro}  onChange={handleChange} className='form-control'/>
              <label>Email:</label>
              <br/>
              <input type="text" name='email' onChange={handleChange} className='form-control'/>
              <label>Telefone:</label>
              <br/>
              <input type="text" name ='telefone' onChange={handleChange} className='form-control'/>             
            </div>
          </ModalBody>
             <ModalFooter>
               <button className='btn btn-primary' onClick={()=>clientePost()}>Incluir</button>{"  "}
               <button className='btn btn-danger' onClick={()=>abrirFecharModalIncluir()}>Cancelar</button>
             </ModalFooter>
        </Modal>


        <Modal isOpen={modalEditar}>
          <ModalHeader>Editar Clientes</ModalHeader>
          <ModalBody>
          
            <div className='form-group'>
            
              <label>Nome:</label>
              <br/>
              <input type="text" name='nome' value={clienteSelecionado && clienteSelecionado.nome } onChange={handleChange} className='form-control'/>
              <label>Sobrenome:</label>
              <br/>
              <input type="text" name='sobrenome' value={clienteSelecionado && clienteSelecionado.sobrenome } onChange={handleChange} className='form-control'/>
              <label>Nacionalidade:</label>
              <br/>
              <input type="text" name='nacionalidade' value={clienteSelecionado && clienteSelecionado.nacionalidade } onChange={handleChange}  className='form-control'/>
              <label>Cep:</label>
              <br/>
              <input type="text" name='cep' onBlur={()=>getCep()} value={clienteSelecionado && clienteSelecionado.cep } onChange={handleChange} className='form-control'/>
              <label>Estado:</label>
              <br/>
              <input type="text" name='estado' value={clienteSelecionado && clienteSelecionado.uf }  onChange={handleChange} className='form-control'/>
              <label>Cidade:</label>
              <br/>
              <input type="text" name='cidade' value={clienteSelecionado && clienteSelecionado.localidade } onChange={handleChange} className='form-control'/>
              <label>Logradouro:</label>
              
              <br/>
              <input type="text" name='logradouro' value={clienteSelecionado && clienteSelecionado.logradouro } onChange={handleChange} className='form-control'/>
              <label>Email:</label>
              <br/>
              <input type="text" name='email' value={clienteSelecionado && clienteSelecionado.email } onChange={handleChange} className='form-control'/>
              <label>Telefone:</label>
              <br/>
              <input type="text" name ='telefone' value={clienteSelecionado && clienteSelecionado.telefone } onChange={handleChange} className='form-control'/>             
            </div>
          </ModalBody>
             <ModalFooter>
               <button className='btn btn-primary'onClick={()=> clientePut()} >Editar</button>{"  "}
               <button className='btn btn-danger' onClick={()=>abrirFecharModalEditar()}>Cancelar</button>
             </ModalFooter>
        </Modal>
    </div>
  );
}

export default App;
