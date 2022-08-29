//Evita que o usuário tenha acesso às variáveis diretamente no console. 
(function () {
	const $ = q => document.querySelector(q); //Em vez de ficar digitando "document.querySelector" no código todo, o "$" funciona como... 
	// uma função que irá fazer isso, onde será passado a informação por parâmetro no q. 
	
	function convertPeriod(mil) {
		const min = Math.floor(mil / 60000); 
		const sec = Math.floor(mil % 60000) / 100; 
		return `${min}m e ${sec}s`;
	}

	function renderGarage() {
		const garage = getGarage(); 
		$("#garage").innerHTML = ""; // "#garage" começa vazio.
		garage.forEach(c => addCarToGarage(c)); // forEach é usado para percorrer arrays. 
	}

	function addCarToGarage (car) {
		const row = document.createElement("tr"); // Cria uma tag tr, seria como escrever <tr> </tr> no html. 
		
		//Código para data atual (dia, mês e ano): 
		const hoje = new Date()
		const dia = hoje.getDate().toString().padStart(2,'0')
		const mes = String(hoje.getMonth() + 1).padStart(2,'0')
		const ano = hoje.getFullYear()
		const dataAtual = `${dia} / ${mes} / ${ano}` 

		// Adicionando os elementos na tabela html: (nome, licence(placa do carro), data, hora e botão para deletar): 
		row.innerHTML =  `
			<td>${car.name}</td> 
			<td>${car.licence}</td> 
			<td data-time="${car.data}">${dataAtual}</td>
			<td data-time="${car.time}">${new Date(car.time).toLocaleString("pt-BR", {
				hour: "numeric", minute: "numeric"})}</td> 
			<td>
				<button class="delete"> Apagar </button> 
			</td> 
		`; 
			$("#garage").appendChild(row); // Adiciona um elemento dentro do outro, (adiciona row no caso). 
	}

	function checkOut(info) {
		let period = new Date() - new Date(info[2].dataset.time); 
		period = convertPeriod(period); 
		
		convertPagamento = parseFloat(period); // Convertendo period para o tipo float.
		valorPagamento = convertPagamento * 0.50; // Multiplicando o tempo que o veículo ficou no estacionamento pelo valor cobrado. 
	
		const licence = info[1].textContent; 
		const msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu estacionado por ${period}.\n\n Valor a pagar: R$ ${valorPagamento}\n\n Deseja encerrar?`;  

		if(!confirm(msg)) return; // Abre uma janela com a mensagem acima, e caso o usuário aperte em "cancelar", a função retorna e para, (ou sja, não faz nada nada). 

		const garage = getGarage().filter(c => c.licence !== licence); 
		localStorage.garage = JSON.stringify(garage); 
		renderGarage();  
	}

	const getGarage = () => {
		return localStorage.garage ? JSON.parse(localStorage.garage) : [];  // Verifica se "garage" já existe, e se já existir...
		//traz ele em formato JSON. Caso não exista, irá retornar um array vazio. 
	}

	renderGarage(); 
	
	$("#send").addEventListener("click", e => {
		

		const name = $("#name").value; 
		const licence = $("#licence").value; 
		
		if (!name || !licence) { //Caso name ou licence sejam falsos (estejam vazios), aparecerá um alerta para preenchimento dos campos. 
			alert("Os campos são obrigatórios!"); 
			return false; // Esse return impede que a função dê continuidade. (Poderia ser apenas return também). 
		}

		const car = { name, licence, data: new Date(), time: new Date() } // Objeto car.
		const garage = getGarage(); 
		garage.push(car); // Objeto garage recebe o objeto car. 

		localStorage.garage = JSON.stringify(garage); // Pega todo o objeto de garage (que está em array), transforma em texto e depois...
		// em objeto de novo para salvar no Local Storage. 
		
		addCarToGarage(car); // Chama a função para adicionar os valores, passando como parâmetro o objeto car. 

		$("#name").value = ""; // Limpa o campo com id="name" quando os valores forem registrados. 
		$("#licence").value = ""; // Limpa o campo com id="licence" quando os valores forem registrados.
	}); 

	// Adicionando evento de click ao botão de classe "garage". 
	$("#garage").addEventListener("click", e => {
		if(e.target.className == "delete") 
			checkOut(e.target.parentElement.parentElement.cells); 
	})

})(); 