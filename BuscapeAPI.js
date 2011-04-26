/**
 * @fileoverview A classe BuscapeAPI foi criada para ajudar no desenvolvimento
 *               de aplicações usando os webservices disponibilizados pela API
 *               do BuscaPé.
 *
 * Os métodos desta classe tem os mesmos nomes dos serviços disponibilizados
 * pelo BuscaPé.
 *
 * @author João Batista Neto
 * @version 0.0.1
 * @license GNU Lesser General Public License Version 2.1, February 1999
 */

/**
 * A cada instância criada deverá ser passado como parâmetro obrigatório o id da
 * aplicação. O Source ID não é obrigatório
 *
 * @constructor
 * @param {String}
 *            applicationId
 * @param {String}
 *            sourceId
 * @throws Caso
 *             o id da aplicação seja inválido
 */
BuscapeAPI = function( applicationId , sourceId ) {
	/**
	 * Id da aplicação
	 *
	 * @type String
	 */
	this.applicationId = '';

	/**
	 * Código do país
	 *
	 * @type String
	 */
	this.countryCode = 'BR';

	/**
	 * Ambiente do serviço
	 *
	 * @type String
	 */
	this.environment = 'bws';

	/**
	 * Formato de retorno padrão
	 *
	 * @type String
	 */
	this.format = 'json';

	/**
	 * Source id
	 *
	 * @type String
	 */
	this.sourceId = '';

	this.setApplicationId( applicationId );
	this.setSourceId( sourceId );
};

/**
 * Recebe a resposta JSON da API do BuscaPé
 *
 * @param {Object}
 *            JSON correspondente a resposta da chamada efetuada
 */
BuscapeAPI.receiveContent = function( result ) {
	BuscapeAPI.bpObject.receiveContent( result );
};

/**
 * Recebe a resposta JSON da API do BuscaPé
 *
 * @param {Object}
 *            JSON correspondente a resposta da chamada efetuada
 */
BuscapeAPI.prototype.receiveContent = function( result ) {
};

/**
 * Método busca retorna os dados da url requisitada
 *
 * @param {String}
 *            serviceName Nome do serviço
 * @param {Object}
 *            args Parâmetros que serão enviados
 * @param {Boolean}
 *            lomadee Indica se será utilizado a API Lomadee
 * @private
 * @return {String} Dados de retorno da URL requisitada
 */
BuscapeAPI.prototype._getContent = function( serviceName , args , lomadee ) {
	var params = '';

	if ( lomadee ) {
		serviceName += '/lomadee';
	}

	if ( args === undefined ) {
		args = {};
	}

	if ( this.sourceId.length > 0 ) {
		args.sourceId = this.sourceId;
	}

	if ( this.format == 'json' ) {
		args.format = this.format;
	
		if ( args.callback !== undefined ) {
			this.receiveContent = args.callback;
		}
	
		args.callback = 'BuscapeAPI.receiveContent';
	}

	for ( var property in args ) {
		params += [ params.length == 0 ? '?' : '&' , [ property , args[ property ] ].join( '=' ) ].join( '' );
	}

	var url = [ 'http:/' , [ this.environment , 'buscape.com/service' ].join( '.' ) , serviceName , this.applicationId , this.countryCode , params ].join( '/' );

	BuscapeAPI.bpObject = this;

	document.write( [ '<script type="text/javascript" src=' , url , '></script>' ].join( '"' ) );
};

/**
 * Serviço utilizado somente na integração do Aplicativo com o Lomadee. Dentro
 * do fluxo de integração, o aplicativo utiliza esse serviço para criar sourceId
 * (código) para o Publisher que deseja utiliza-lo. Os parâmetros necessários
 * neste serviço são informados pelo próprio Lomadee ao aplicativo. No ambiente
 * de homologação sandbox, os valores dos parâmetros podem ser fictícios pois
 * neste ambiente este serviço retornará sempre o mesmo sourceId para os testes
 * do Developer.
 *
 * Todos os parâmetros necessários para a busca são informados em um objeto que
 * deve ser passado para o método, são eles:
 *
 * <ul>
 * <li>sourceName = Nome do código.</li>
 * <li>publisherId = ID do publisher.</li>
 * <li>siteId = ID do site selecionado pelo publisher.</li>
 * <li>campaignList = Lista de IDs das campanhas separados por vírgula.</li>
 * <li>token = Token utilizado para validação da requisição.</li>
 * </ul>
 *
 * @param {Object}
 *            args
 * @return {String} O sourceId
 */
BuscapeAPI.prototype.createSourceId = function( args ) {
	return this._getContent( 'createSource' , args , true );
};

/**
 * Método faz busca de categorias, permite que você exiba informações relativas
 * às categorias. É possível obter categorias, produtos ou ofertas informando
 * apenas um ID de categoria.
 *
 *
 * <ul>
 * <li>categoryId = Id da categoria</li>
 * <li>keyword = Palavra-chave buscada entre as categorias</li>
 * <li>callback = Função de retorno a ser executada caso esteja usando o método
 * json como retorno.</li>
 * </ul>
 *
 * Se não for informado nenhum dos parâmetros, a função retornará por padrão uma
 * lista de categorias raiz, de id 0.
 *
 * @param {Object}
 *            args Parâmetros passados para gerar a url de requisição
 * @return {String} Retorno da pesquisa feita no BuscaPé, no formato requerido.
 * @throws Se
 *             a palavra chave for uma string vazia.
 * @throws Se
 *             o id da categoria for menor que zero.
 */
BuscapeAPI.prototype.findCategoryList = function( args ) {
	return this._getContent( 'findCategoryList' , this.validateParams( {
		categoryId : 0
	} , [] , [ 'categoryId' , 'keyword' ] ) , false );
};

/**
 * Método busca uma lista de ofertas. É possível obter a lista de ofertas
 * informando o ID do produto.
 *
 * Todos os parâmetros necessários para a busca são informados em um array que
 * deve ser passado para o método, são eles:
 *
 * <ul>
 * <li>categoryId = Id da categoria</li>
 * <li>keyword = Palavra-chave buscada entre as categorias</li>
 * <li>productId = Id do produto</li>
 * <li>barcode = Código de barras do produto</li>
 * <li>callback = Função de retorno a ser executada caso esteja usando o método
 * json como retorno.</li>
 * </ul>
 *
 * Pelo menos um dos parâmetros de pesquisa devem ser informados para o retorno
 * da função. Os parâmetros <categoryId> e <keyword> podem ser usados em
 * conjunto.
 *
 * @param array
 *            $args Parâmetros passados para gerar a url de requisição.
 * @param boolean
 *            $lomadee Indica se deverá ser utilizada a API do Lomadee
 * @return string Retorno da pesquisa feita no BuscaPé, no formato requerido.
 * @throws UnexpectedValueException
 *             Se nenhum parâmetro for passado
 * @throws UnexpectedValueException
 *             Se o id da categoria for menor que zero.
 * @throws UnexpectedValueException
 *             Se o id do produto for menor que zero.
 * @throws UnexpectedValueException
 *             Se a palavra chave for uma string vazia.
 */
BuscapeAPI.prototype.findOfferList = function( args , lomadee ) {
	return this._getContent( 'findOfferList' , this.validateParams( args , [] , [ 'categoryId' , 'productId' , 'keyword' ] ) , lomadee );
};

/**
 * Método permite que você busque uma lista de produtos únicos utilizando o id
 * da categoria final ou um conjunto de palavras-chaves ou ambos.
 *
 * Todos os parâmetros necessários para a busca são informados em um array que
 * deve ser passado para o método, são eles:
 *
 * <ul>
 * <li>categoryId = Id da categoria</li>
 * <li>keyword = Palavra-chave buscada entre as categorias</li>
 * <li>callback = Função de retorno a ser executada caso esteja usando o método
 * json como retorno.</li>
 * </ul>
 *
 * Pelo menos um dos parâmetros, <categoryID> ou <keyword> são requeridos para
 * funcionamento desta função. Os dois também podem ser usados em conjunto. Ou
 * seja, podemos buscar uma palavra-chave em apenas uma determinada categoria.
 *
 * @param {Object}
 *            args Parâmetros para gerar a url de requisição
 * @param {Boolean}
 *            lomadee Indica se deverá ser utilizada a API do Lomadee
 * @return {String} Retorno da pesquisa feita no BuscaPé, no formato requerido.
 * @throws Se
 *             nenhum parâmetro for passado.
 * @throws Se
 *             o id da categoria for menor que zero.
 * @throws Se
 *             a palavra chave for uma string vazia.
 */
BuscapeAPI.prototype.findProductList = function( args , lomadee ) {
	return this._getContent( 'findProductList' , this.validateParams( args , [] , [ 'categoryId' , 'keyword' ] ) , lomadee );
};

/**
 * Retorna o Id da aplicação
 *
 * @return {String}
 */
BuscapeAPI.prototype.getApplicationId = function() {
	return this.applicationId;
};

/**
 * Retorna o código do país
 *
 * @return {String}
 */
BuscapeAPI.prototype.getCountryCode = function() {
	return this.countryCode;
};

/**
 * Retorna o ambiente de integração
 *
 * @return {String}
 */
BuscapeAPI.prototype.getEnvironment = function() {
	return this.environment;
};

/**
 * Retorna o formato de retorno
 *
 * @return {String}
 */
BuscapeAPI.prototype.getFormat = function() {
	return this.format;
};

/**
 * Retorna o Source ID
 *
 * @return {String}
 */
BuscapeAPI.prototype.getSourceId = function() {
	return this.sourceId;
};

/**
 * Define o Id da aplicação
 *
 * @param {String}
 *            applicationId O id da aplicação
 * @throws Caso
 *             o ID da aplicação seja inválido
 */
BuscapeAPI.prototype.setApplicationId = function( applicationId ) {
	applicationId = applicationId + '';

	if ( applicationId.split( ' ' ).join( '' ).length == 0 ) {
		throw 'Id da aplicação inválido';
	}
	else {
		this.applicationId = applicationId;
	}
};

/**
 * Define o código do país
 *
 * @param {String}
 *            countryCode (AR|BR|CL|CO|MX|PE|VE)
 * @throws Se
 *             o código do país não existir
 */
BuscapeAPI.prototype.setCountryCode = function( countryCode ) {
	switch ( countryCode ) {
		case 'AR':
		case 'BR':
		case 'CL':
		case 'CO':
		case 'MX':
		case 'PE':
		case 'VE':
			this.countryCode = countryCode;
			break;
		default:
			throw [ 'Código do país' , countryCode , 'não existe' ].join( ' ' );
	}
};

/**
 * Define o formato de retorno
 *
 * @param {String}
 *            format (xml|json)
 * @throws Se
 *             o formato não existir
 */
BuscapeAPI.prototype.setFormat = function( format ) {
	switch ( format ) {
		case 'xml':
		case 'json':
			this.format = format;
			break;
		default:
			throw [ 'O formato de retorno' , format , 'não existe' ].join( ' ' );
	}
};

/**
 * Define se a integração vai ser feita no sandbox ou não
 */
BuscapeAPI.prototype.setSandbox = function() {
	this.environment = 'sandbox';
};

/**
 * Define o Source Id
 *
 * @param {String}
 *            sourceId
 */
BuscapeAPI.prototype.setSourceId = function( sourceId ) {
	this.sourceId = sourceId;
};

/**
 * Método retorna os produtos mais populares do BuscaPé
 *
 * Todos os parâmetros necessários para a busca são informados em um array que
 * deve ser passado para o método, são eles:
 *
 * <ul>
 * <li>callback = Função de retorno a ser executada caso esteja usando o método
 * json como retorno.</li>
 * </ul>
 *
 * @param array
 *            $args Parâmetros passados para gerar a url de requisição.
 * @return string Retorno da pesquisa feita no BuscaPé, no formato requerido.
 * @throws UnexpectedValueException
 *             Se o id da categoria for menor que zero.
 */
BuscapeAPI.prototype.topProducts = function( args ) {
	return this._getContent( 'topProducts' , this.validateParams( args ) );
};

/**
 * Valida os parâmetros que serão enviados à API do BuscaPé
 *
 * @param {Object}
 *            args Matriz com os parâmetros
 * @param {Array}
 *            and Lista de parâmetros obrigatórios
 * @param {Array}
 *            or Lista de parâmetros opcionais, mas que pelo menos 1 deve
 *            existir
 * @private
 * @return {Object}
 * @throws Se
 *             algum dos parâmetros forem inválidos
 * @throws Se
 *             nenhum dos parâmetros opcionais forem passados
 */
BuscapeAPI.prototype.validateParams = function( args , and , or ) {
	if ( args instanceof Object ) {
		if ( args.keyword !== undefined ) {
			args.keyword = [ args.keyword ].join( '' ).split( ' ' ).join( '' );
		
			if ( args.keyword.length == 0 ) {
				throw 'A palavra chave não pode ser uma string vazia';
			}
		}
	
		if ( args.categoryId !== undefined ) {
			args.categoryId = args.categoryId instanceof Number ? args.categoryId : parseInt( args.categoryId );
		
			if ( isNaN( args.categoryId ) || args.categoryId < 0 ) {
				throw 'O id da categoria deve ser um número maior ou igual a zero';
			}
		}
	
		if ( args.productId !== undefined ) {
			args.productId = args.productId instanceof Number ? args.productId : parseInt( args.productId );
		
			if ( isNaN( args.productId ) || args.productId < 0 ) {
				throw 'O id do produto deve ser um número maior ou igual a zero';
			}
		}
	
		if ( args.sellerId !== undefined ) {
			args.sellerId = args.sellerId instanceof Number ? args.sellerId : parseInt( args.sellerId );
		
			if ( isNaN( args.sellerId ) || args.sellerId < 0 ) {
				throw 'O id da loja/empresa deve ser um número maior ou igual a zero';
			}
		}
	
		var i, t, f;
	
		if ( and !== undefined ) {
			for ( i = 0 , t = and.length ; i < t ; ++i ) {
				if ( args[ and[ i ] ] === undefined ) {
					throw [ 'O parâmetro' , and[ i ] , 'é requerido' ].join( ' ' );
				}
			}
		}
	
		if ( or !== undefined ) {
			for ( i = 0 , t = or.length , f = 0 ; i < t ; ++i ) {
				if ( args[ or[ i ] ] !== undefined ) {
					++f;
					break;
				}
			}
		
			if ( t != 0 && f == 0 ) {
				throw [ 'Pelo menos um dos parâmetros: "' , or.join( '","' ) , '" devem ser passados' ].join( '' );
			}
		}
	
		return args;
	}
};

/**
 * Função retorna os detalhes técnicos de um determinado produto.
 *
 * Todos os parâmetros necessários para a busca são informados em um array que
 * deve ser passado para o método, são eles:
 *
 * <ul>
 * <li>productId = Id do produto (requerido)</li>
 * <li>callback = Função de retorno a ser executada caso esteja usando o método
 * json como retorno.</li>
 * </ul>
 *
 * @param {Object}
 *            args Parâmetros passados para gerar a url de requisição.
 * @return {String} Função de retorno a ser executada caso esteja usando o
 *         método
 * @throws Se
 *             o ID do produto não for passado
 */
BuscapeAPI.prototype.viewProductDetails = function( args ) {
	return this._getContent( 'viewProductDetails' , this.validateParams( args , [ 'productId' ] , [] ) , false );
};

/**
 * Função retorna os detalhes da loja/empresa como: endereços, telefones de
 * contato etc...
 *
 * Todos os parâmetros necessários para a busca são informados em um array que
 * deve ser passado para o método, são eles:
 *
 * <ul>
 * <li>sallerId = Id da loja/empresa (requerido)</li>
 * <li>callback = Função de retorno a ser executada caso esteja usando o método
 * json como retorno.</li>
 * </ul>
 *
 * @param {Object}
 *            args Parâmetros passados para gerar a url de requisição.
 * @return {String} Função de retorno a ser executada caso esteja usando o
 *         método.
 * @throws Se
 *             o ID da loja não for passado
 */
BuscapeAPI.prototype.viewSellerDetails = function( args ) {
	return this._getContent( 'viewSellerDetails' , this.validateParams( args , [ 'sellerId' ] , [] ) , false );
};

/**
 * Método retorna as avaliações dos usuários sobre um determinado produto
 *
 * Todos os parâmetros necessários para a busca são informados em um array que
 * deve ser passado para o método, são eles:
 *
 * <ul>
 * <li>productId = Id do produto (requerido)</li>
 * <li>callback = Função de retorno a ser executada caso esteja usando o método
 * json como retorno.</li>
 * </ul>
 *
 * @param {Object}
 *            args Parâmetros passados para gerar a url de requisição.
 * @return {String} Retorno da pesquisa feita no BuscaPé, no formato requerido.
 * @throws Se
 *             o ID do produto não for passado.
 * @throws Se
 *             o ID do produto for menor que zero.
 */
BuscapeAPI.prototype.viewUserRatings = function( args ) {
	return this._getContent( 'viewUserRatings' , this.validateParams( args , [ 'productId' ] , [] ) , false );
};