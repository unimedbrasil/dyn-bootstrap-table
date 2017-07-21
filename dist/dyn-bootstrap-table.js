(function() {
    'use strict';

    angular
        .module('dyn.bootstrap-table', ['bsTable']);
})();

(function() {
    'use strict';

    angular
        .module('dyn.bootstrap-table')
        .service('DynBootstrapTableFormatters', DynBootstrapTableFormatters);

    DynBootstrapTableFormatters.$inject = [];

    /**
     * Servico auxiliar ao bootstrap-table para armazenamento de formatters comuns.
     */
    function DynBootstrapTableFormatters() {

        var _this = this;

        /**
         * Encapsula o valor da célula dentro de uma tag html anchor.
         * @param  {String}     className  Class css a ser aplicada no link. Usado para estilização e/ou setar o link.
         * @Param  {String}     href       Opcionalmente pode-se informar uma URL para colocar no anchor.
         * @return {Function}              Função de formatação.
         */
        _this.getAnchorFormatter = function(className, href) {
            /**
             * Formatter de texto para anchor html.
             * @param  {Object} value Valor célula a ser formatada.
             * @param  {Object} row   Linha da coluna a ser formatada.
             * @param  {Number} index Indice da célula na tabela.
             * @return {String}       Valor formatado da célula.
             */
            /*jshint scripturl:true*/
            return function(value, row, index) {
                if (value) {
                    var html = [];
                    html.push('<a class="');
                    html.push(className);
                    html.push('"');
                    html.push(' href="');
                    if (href) {
                        html.push(href);
                    } else {
                        html.push('javascript:void(0);');
                    }
                    html.push('">');
                    html.push(value);
                    html.push('</a>');
                    return html.join('');
                }
                return value;
            };
        };

        /**
         * Converte valores booleanos para textos especificados.
         * @param  {String}     trueValue  Texto a ser usado quando o valor for true.
         * @param  {String}     falseValue Texto a ser usado quando o valor for false.
         * @return {Function}              Função de formatação.
         */
        _this.getBooleanFormatter = function(trueValue, falseValue) {
            /**
             * Formatter de boolean para texto.
             * @param  {Object} value Valor célula a ser formatada.
             * @param  {Object} row   Linha da coluna a ser formatada.
             * @param  {Number} index Indice da célula na tabela.
             * @return {String}       Valor formatado da célula.
             */
            return function(value, row, index) {
                return value === true ? trueValue : falseValue;
            };
        };

        /**
         * Converte os valores string para um objeto Date, e depois para string novamente no padrão especificado.
         * @param  {String} inputFormat     Formato da string data recebida
         * @param  {String} outputFormat    Formato da string data a ser exibida.
         * @return {Function}               Função de formatação.
         */
        _this.getDateFormatter = function(inputFormat, outputFormat) {
            /**
             * Formatter para converter e exibir campo date
             * @param  {Object} value Valor célula a ser formatada.
             * @param  {Object} row   Linha da coluna a ser formatada.
             * @param  {Number} index Indice da célula na tabela.
             * @return {String}       Valor formatado da célula.
             */
            return function(value, row, index) {
                if (value) {
                    return moment(value, inputFormat).format(outputFormat);
                }
                return value;
            };
        };

        /**
         * COnverte os valores string date no padrão ISO 8601 para o formato especificado.
         * @param  {String} outputFormat    Formato da data a ser exibida (moment.js)
         * @return {Function}               Função de formatação.
         */
        _this.getISO8601DateFormatter = function(outputFormat) {
            /**
             * Formatter para converter e exibir campo date
             * @param  {Object} value Valor célula a ser formatada.
             * @param  {Object} row   Linha da coluna a ser formatada.
             * @param  {Number} index Indice da célula na tabela.
             * @return {String}       Valor formatado da célula.
             */
            return function(value, row, index) {
                if (value) {
                    return moment(value).format(outputFormat);
                }
                return value;
            };
        };

        /**
         * Converte valores nulos ou que não foram retornados no valor padrão especificado.
         * @param  {String}     defaultValue  Valor a ser usado quando o valor não existir.
         * @return {Function}                 Função de formatação.
         */
        _this.getDefaultFormatter = function(defaultValue) {
            /**
             * Formatter de nulo/undefined para o valor padrão.
             * @param  {Object} value Valor célula a ser formatada.
             * @param  {Object} row   Linha da coluna a ser formatada.
             * @param  {Number} index Indice da célula na tabela.
             * @return {String}       Valor formatado da célula.
             */
            return function(value, row, index) {
                return value ? value : defaultValue;
            };
        };

    }
})();

(function() {
    'use strict';

    angular
        .module('dyn.bootstrap-table')
        .factory('DynBootstrapTable', DynBootstrapTable);

    DynBootstrapTable.$inject = ['$document'];

    /**
     * Servico para criação e manipulação do bootstrap-table.
     */
    function DynBootstrapTable($document) {
        // Workaround para trabalhar com o factory/service sem ser um singleton
        // https://github.com/angular/angular.js/issues/2708
        return function() {
            return new DynaBootstrapTable($document);
        };
    }

    /**
     * Builder para criação do componente bootstrap-table.
     */
    function DynaBootstrapTable($document) {

        var _this = this;

        /**
         * Options padrão da criação da tabela.
         */
        var mDefaultOptions = {
            mobileResponsive: true,
            minWidth: 752,
            striped: true,
            pagination: true,
            sidePagination: 'server',
            showColumns: true,
            pageList: [],
            pageSize: 10,
            paginationPreText: 'Anterior',
            paginationNextText: 'Próximo',
            sortable: true
        };

        /**
         * Options que serão usada na criação da tabela.
         */
        var mOptions = $.extend(true, {}, mDefaultOptions);

        /**
         * Html element da tabela.
         */
        var mElementID = null;

        /**
         * Colunas da tabela.
         */
        var mColumns = [];

        /**
         * Total de linhas na pesquisa.
         */
        var total = 0;

        /**
         * Inicia a utilização da bootstrap-table.
         * @param  {String}                 tableId Id da tabela na tela.
         * @return {DynaBootstrapTable}             Retorna a própria instancia.
         */
        _this.init = function(tableId) {
            mElementID = tableId;
            return _this;
        };

        /**
         * Define a função responsável por consultar os dados no servidor.
         * @param  {function}               callbackFn  Função que consulta os dados no servidor.
         * @return {DynaBootstrapTable}                 Retorna a própria instancia.
         */
        _this.setFetchFunction = function(callbackFn) {
            checkElement();
            // Merge da funcao de consulta do usuario com os options de ajax da tabela.
            jQuery.extend(true, mOptions, {
                ajax: function(params) {
                    return callbackFn(params.data, function(result) {
                        responseFetchFunction(result, params);
                    }, function(result) {
                        // Enviar vazio para a tabela.
                        // @TODO Enviar erro para quem chamou
                        responseFetchFunction(_this.emptyFetchData(), params);
                    });
                }
            });
            return _this;
        };

        /**
         * Trata o response da requisção. Verifica se a tabela esta trabalhando em client-side ou server-side.
         * @param  {Object} result Resultado da consulta.
         * @param  {Object} params Objeto de callback do bootstrap-table.
         */
        function responseFetchFunction(result, params) {
            // Usuário pode ter passado direto o response da requisicao, ou uma lista pronta.
            var data = result.data ? result.data : result;
            // O tratamento para server e client é diferenciado
            if (mOptions.sidePagination === 'server') {
                total = data.total;
                params.success({
                    total: total,
                    rows: data.rows
                });
            } else {
                // client side trabalha com a lista corrida
                total = data.length;
                params.success(data);
            }
        }

        /**
         * Define a lista de objetos staticos que serão exibidos na tabela.
         * @param  {Array} data Lista de objetos
         */
        _this.setDataList = function(dataList) {
            checkElement();
            mOptions.data = dataList;
            return _this;
        };

        /**
         * Define novas propriedades para o defaultOptions.
         * @param  {Object}                 options Novas propriedades.
         * @return {DynaBootstrapTable}             Retorna a própria instancia.
         */
        _this.setOptions = function(userOptions) {
            checkElement();
            // Merge dos parametros gerais do usuário os options da tabela.
            jQuery.extend(true, mOptions, userOptions);
            return _this;
        };

        /**
         * Define a função de callback responsável por montar e retornar os parametros que serão enviados na requisição para o servidor.
         * @param  {function}               callbackFn  Função que monta e retorna os parâmetros em forma de objeto json.
         * @return {DynaBootstrapTable}                 Retorna a própria instancia.
         */
        _this.setFetchParametersFunction = function(callbackFn) {
            checkElement();
            // Merge dos parametros de consulta com os options da tabela.
            jQuery.extend(true, mOptions, {
                // Merge do queryParams dentro do options
                queryParams: function(params) {
                    // Parametros de paginação do componente
                    var customParams = {
                        limit: params.limit,
                        offset: params.offset
                    };
                    // Merge com os parametros da consulta do usuario,
                    // ele pode sobrescrever os parametros de paginacao
                    jQuery.extend(true, customParams, callbackFn());
                    return customParams;
                }
            });
            return _this;
        };

        /**
         * Define as colunas que a tabela irá exibir em tela.
         * @param  {Array}                  userColumns Array de objetos com a definição das colunas da tabela.
         * @return {DynaBootstrapTable}                 Retorna a própria instancia.
         */
        _this.setColumnsList = function(userColumns) {
            checkElement();
            // Merge das colunas do usuário com os options da tabela.
            jQuery.extend(true, mOptions, {
                columns: userColumns
            });
            return _this;
        };

        /**
         * Registra um callback para quando alguma linha da tabela for checada.
         * O callback irá receber um Array de rows e o estado, true se foi checado, false caso contrário.
         * @param  {Function}               callback    Callback a ser chamado quando uma ou mais linhas forem selecionadas.
         * @return {DynaBootstrapTable}                 Retorna a própria instancia.
         */
        _this.onCheckRows = function(callback) {
            checkElement();
            // Merge com os options da tabela.
            jQuery.extend(true, mOptions, {
                onCheck: function(row, $element) {
                    callback([row], true);
                },
                onCheckAll: function(rows) {
                    callback(rows, true);
                },
                onCheckSome: function(rows) {
                    callback(rows, true);
                },
                onUncheck: function(row, $element) {
                    callback([row], false);
                },
                onUncheckAll: function(rows) {
                    callback(rows, false);
                },
                onUncheckSome: function(rows) {
                    callback(rows, false);
                }
            });
            return _this;
        };

        /**
         * Registra um callback para manipular o response antes da tabela fazer algo com ele.
         * O response recebido deve ser retornado após alteração.
         * @param  {Function}               callback    Callback a ser chamado quando os dados forem consultados.
         * @return {DynaBootstrapTable}                 Retorna a própria instancia.
         */
        _this.setResponseHandler = function(callback) {
            checkElement();
            // Merge com os options da tabela.
            jQuery.extend(true, mOptions, {
                responseHandler: callback
            });
            return _this;
        };

        /**
         * Cria os parametros necessarios para o funcionamento do bootstrap-table.
         * @return {Object} Objeto com os parametros do componente.
         */
        _this.create = function() {
            checkElement();
            buildColumns();
            return {
                options: mOptions
            };
        };

        /**
         * Atualiza a bootstrap-table para que ela execute a consulta com os parametros definidos.
         */
        _this.refresh = function() {
            checkElement();
            $document.find(mElementID).bootstrapTable('refresh');
        };


        /**
         * Atualiza a bootstrap-table para que ela execute a consulta com os parametros definidos.
         */
        _this.search = function() {
            checkElement();
            // Trata o search diferente no modo server-side e client-side
            if (mOptions.sidePagination === 'server') {
                // Verifica se a tabela esta exibindo dados atualmente
                var data = $document.find(mElementID).bootstrapTable('getData');
                // Se sim, só manda para a primeira página que ele vai renovar os dados no servidor
                if (data && data.length > 0) {
                    $document.find(mElementID).bootstrapTable('selectPage', 1);
                }
                // Se a tabela estiver vazia, chama o próprio refresh para atualizar.
                // Chamar o refresh com dados mantem ele na paginação atual.
                // Mandar ir para a pagina 1 quando não tem dados não atualiza a tabela.
                else {
                    _this.refresh();
                }
            }
            // Quando é client side, mada ir para a primeira pagina e dá um refresh.
            else {
                $document.find(mElementID).bootstrapTable('selectPage', 1);
                _this.refresh();
            }
        };

        /**
         * Retorna a row para o id especificado.
         * @param  {String} uniqueId ID unico da row a ser pesquisada.
         * @return {Object}          Row da tabela com o uniqueId.
         */
        _this.getRowByUniqueId = function(uniqueId) {
            checkElement();
            return $document.find(mElementID).bootstrapTable('getRowByUniqueId', uniqueId);
        };

        /**
         * Retorna a página atual. -1 caso não seja possível encontrar
         * @return {Int}         Número da página atual.
         */
        _this.getCurrentPage = function() {
            checkElement();
            var options = $document.find(mElementID).bootstrapTable('getOptions');
            if (options && options.hasOwnProperty('pageNumber')) {
                return options.pageNumber;
            }
            return -1;
        };

        /**
         * Atualiza uma row da tabela.
         * @param  {Object} uniqueId ID unico da row a ser pesquisada.
         * @param  {Object} row      Row da tabela com o uniqueId.
         */
        _this.updateByUniqueId = function(uniqueId, row) {
            checkElement();
            $document.find(mElementID).bootstrapTable('updateByUniqueId', {
                id: uniqueId,
                row: row
            });
        };

        /**
         * Remove uma row da tabela.
         * @param  {Object} uniqueId ID unico da row a ser pesquisada.
         * @return {Object}          Row da tabela com o uniqueId.
         */
        _this.removeByUniqueId = function(uniqueId) {
            checkElement();
            $document.find(mElementID).bootstrapTable('removeByUniqueId', uniqueId);
        };

        /**
         * Insere uma lista de objetos staticos no final da tabela.
         * @param  {Array} data Lista de objetos
         */
        _this.appendDataList = function(dataList) {
            checkElement();
            $document.find(mElementID).bootstrapTable('append', dataList);
        };

        /**
         * Insere um objeto statico no final da tabela.
         * @param  {Objecto} data Objeto a ser inserido na tabela.
         */
        _this.appendData = function(data) {
            _this.appendDataList([data]);
        };

        /**
         * Limpa os dados da tabela.
         */
        _this.clear = function() {
            checkElement();
            $document.find(mElementID).bootstrapTable('removeAll');
        };

        /**
         * Destroi a tabela.
         */
        _this.destroy = function() {
            checkElement();
            $document.find(mElementID).bootstrapTable('destroy');
        };

        /**
         * Adiciona a especificação de uma coluna na tabela.
         * @param  {String}                     field   ID do campo a ser exibido.
         * @param  {String}                     title   Titulo do campo a ser exibido.
         * @return {DynaBootstrapTableColumn}           Instancia de DynaBootstrapTableColumn.
         */
        _this.addColumn = function(field, title) {
            var column = new DynaBootstrapTableColumn();
            column.setField(field);
            column.setTitle(title);
            mColumns.push(column);
            return column;
        };

        /**
         * Define toda a especificação das colunas da tabela.
         * @param  {Array} columnsList  Array de objetos com a definição das colunas da tabela.
         */
        _this.setColumnsList = function(columnsList) {
            mColumns = columnsList;
        };

        /**
         * Cria um UniqueID e seta nos objetos da lista, na propriedade com o nome definido.
         * @param  {[type]} dataList   Lista de objetos que irão receber o uniqueID.
         * @param  {[type]} uniqueName A nome da propriedade que armazenará o uniqueID.
         */
        _this.setDataListUniqueID = function(dataList, uniqueName) {
            if (dataList) {
                jQuery.each(dataList, function(index, item) {
                    _this.setDataUniqueID(item, uniqueName);
                });
            }
        };

        /**
         * Cria um UniqueID e seta no objeto na propriedade com o nome definido.
         * @param  {[type]} data       Objeto que irá receber o uniqueID.
         * @param  {[type]} uniqueName A nome da propriedade que armazenará o uniqueID.
         */
        _this.setDataUniqueID = function(data, uniqueName) {
            if (data) {
                data[uniqueName] = _this.generateUniqueID();
            }
        };

        /**
         * Gera um UUID unico. Pode ser utilizado para diferenciar cada linha da tabela caso os dados exibidos não tenham um ID único.
         * @return {String} UUID
         */
        _this.generateUniqueID = function() {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };

        /**
         * Retorna o objeto de resposta padrão da tabela, só que vazio.
         * @return {Object} Objeto de dados padrão do bootstrap-table.
         */
        _this.emptyFetchData = function() {
            var data = null;
            if (mOptions.sidePagination === 'server') {
                data = {
                    total: 0,
                    rows: []
                };
            } else {
                data = [];
            }
            return data;
        };

        /**
         * Retorna o total de resultados existentes para a pesquisa atual.
         * @return {Number} Total de resultados.
         */
        _this.getTotal = function() {
            return total;
        };

        /**
         * Monta a lista de especificação das colunas.
         */
        var buildColumns = function() {
            var columnsResult = [];
            jQuery.each(mColumns, function(index, column) {
                if (column instanceof DynaBootstrapTableColumn) {
                    columnsResult.push(column.build());
                } else {
                    columnsResult.push(column);
                }
            });
            // Merge com os options da tabela.
            $.extend(true, mOptions, {
                columns: columnsResult
            });
        };

        /**
         * Verifica se a tabela foi iniciada.
         */
        var checkElement = function() {
            if (!mElementID) throw "DynaBootstrapTable deve ser inicializado com o método init(tableId)";
        };
    }

    /**
     * Representa uma coluna da tabela.
     */
    function DynaBootstrapTableColumn() {

        var _this = this;
        var mField = null;
        var mTitle = null;
        var mAlign = null;
        var mVAlign = null;
        var mCheckbox = false;
        var mFormatter = null;
        var mEvents = null;
        var mWidth = null;
        var mClass = null;
        var mActions = [];

        /**
         * Especifica o field da coluna.
         * @param  {String}                     field  Field da coluna.
         * @return {DynaBootstrapTableColumn}          Retorna a própria instancia.
         */
        _this.setField = function(field) {
            mField = field;
            return _this;
        };

        /**
         * Especifica o title da coluna.
         * @param  {String}                     title  Título da coluna.
         * @return {DynaBootstrapTableColumn}          Retorna a própria instancia.
         */
        _this.setTitle = function(title) {
            mTitle = title;
            return _this;
        };

        /**
         * Especifica o alinhamento da celula.
         * @param  {String}                     align  Alinhamento dos valores da celula.
         * @return {DynaBootstrapTableColumn}          Retorna a própria instancia.
         */
        _this.setVAlign = function(align) {
            mVAlign = align;
            return _this;
        };

        /**
         * Especifica o alinhamento da coluna.
         * @param  {String}                     align  Alinhamento dos valores da coluna.
         * @return {DynaBootstrapTableColumn}          Retorna a própria instancia.
         */
        _this.setAlign = function(align) {
            mAlign = align;
            return _this;
        };

        /**
         * Especifica se a coluna é um checkbox.
         * @param  {Boolean}                     hasCheckbox    Indica se a coluna vai ter um checkbox.
         * @return {DynaBootstrapTableColumn}                   Retorna a própria instancia.
         */
        _this.setCheckbox = function(hasCheckbox) {
            mCheckbox = hasCheckbox;
            return _this;
        };

        /**
         * Especifica o tamanho da coluna.
         * @param  {Boolean}                   width   Tamanho da coluna.
         * @return {DynaBootstrapTableColumn}          Retorna a própria instancia.
         */
        _this.setWidth = function(width) {
            mWidth = width;
            return _this;
        };

        /**
         * Especifica o class da coluna.
         * @param  {String}                   class    Class CSS.
         * @return {DynaBootstrapTableColumn}          Retorna a própria instancia.
         */
        _this.setClass = function(clazz) {
            mClass = clazz;
            return _this;
        };

        /**
         * Especifica o formatter da tabela.
         * @param  {Function}                   callback    Callback a ser chamado quando os dados forem ser exibidos.
         *                                                  O callback recebera os parâmetros value, row e index.
         * @return {DynaBootstrapTableColumn}               Retorna a própria instancia.
         */
        _this.setFormatter = function(callback) {
            mFormatter = callback;
            return _this;
        };

        /**
         * Define um click listener para um elemento com o className especificado.
         * @param  {String}                     className   Nome da class css a ser bindada.
         * @param  {Function}                   callback    Callback chamado quando o elemento receber um evento de click.
         *                                                	O callback recebera os parâmetros e, value, row e index.
         * @return {DynaBootstrapTableColumn}               Retorna a própria instancia.
         */
        _this.setOnAtionClickListener = function(className, callback) {
            mEvents = mEvents || {};
            var mClassName = className;
            if (mClassName.charAt(0) != '.') {
                mClassName = '.' + mClassName;
            }
            mEvents['click ' + mClassName] = function(e, value, row, index) {
                callback(e, value, row, index);
            };
            return _this;
        };

        /**
         * Adiciona uma action na última coluna da tabela.
         * O class name pode ser uma class do font-awesome ou qualquer outra
         * class customizada que será inserida em um elemento <i>.
         *
         * Caso o callback não seja informado, o usuário poderá adicionário
         * posteriormente através do método setOnClickListener.
         *
         * @param  {String}                     className   Class css a ser usada na customização da action.
         * @param  {String}                     title       Titulo descritivo da action.
         * @return {Function}                   callback    Função de callback para quando o usuário clicar na action.
         *                                                  O callback recebera os parâmetros index, row e actionIndex.
         * @return {DynaBootstrapTableColumn}               Retorna a própria instancia.
         */
        _this.addAction = function(className, title, callback) {
            var index = mActions.push({
                className: className,
                title: title
            });
            if (callback) {
                var actionIndex = (index - 1);
                _this.setOnAtionClickListener('dyn-bootstrap-table-action-' + actionIndex, function(e, value, row, index) {
                    callback(index, row, actionIndex);
                });
            }
            return _this;
        };

        /**
         * Adiciona uma action dinamica na última coluna da tabela.
         * Deve ser passando no objeto de parâmetro uma propriedade 'actionFormatter'
         * que será uma função chamada no momento de renderizar a mesma. Ficará a cargo do desenvolvedor
         * criar o elemento com icone que será exibido. A função 'actionFormatter' será chamada com os seguintes parâmetros:
         * - row:               Objeto que representa os valores da linha atual da tabela.
         * - index:             Indice da linha na tabela.
         * - actionIndex:       Indice da action na coluna.
         * - clickEventClass:   Nome da class css que será utilizada para bindar o evento de onClick.
         *   			 		Fica a cargo do desenvolvedor aplicar essa class no elemento criado.
         *
         * @return {Object}                     options    Objeto com os parâmetros para criação da coluna.
         * @return {DynaBootstrapTableColumn}              Retorna a própria instancia.
         */
        _this.addDynamicAction = function(options) {
            var index = mActions.push({
                actionFormatter: options.actionFormatter
            });
            if (options.callback) {
                var actionIndex = (index - 1);
                _this.setOnAtionClickListener('dyn-bootstrap-table-action-' + actionIndex, function(e, value, row, index) {
                    options.callback(index, row, actionIndex);
                });
            }
            return _this;
        };

        /**
         * Monta as options da coluna para a bootstrap-table.
         * @return {Object} Options de configuração da coluna.
         */
        _this.build = function() {
            var column = {};
            if (mField) column.field = mField;
            if (mTitle) column.title = mTitle;
            if (mAlign) column.align = mAlign;
            if (mVAlign) column.valign = mVAlign;
            if (mCheckbox) column.checkbox = mCheckbox;
            if (mFormatter) column.formatter = mFormatter;
            if (mEvents) column.events = mEvents;
            if (mWidth) column.width = mWidth;
            if (mClass) column.class = mClass;
            if (mActions && mActions.length > 0) {
                if (mFormatter) {
                    throw "DynaBootstrapTableColumn não pode ter um formatter e actions especificadas ao mesmo tempo.";
                }
                column.formatter = actionsFormatter;
            }
            return column;
        };

        /**
         * Caso o usuário não especifica um formatter para a coluna de action, será utilizado esse por padrão.
         * @param  {Object} value Valor célula a ser formatada.
         * @param  {Object} row   Linha da coluna a ser formatada.
         * @param  {Number} index Indice da célula na tabela.
         * @return {String}       Valor formatado da célula.
         */
        var actionsFormatter = function(value, row, index) {
            var htmlArray = [];
            htmlArray.push('<div class="actions-list">');
            jQuery.each(mActions, function(actionIndex, action) {
                var clickEventClass = 'dyn-bootstrap-table-action-' + actionIndex;
                if (action.actionFormatter) {
                    htmlArray.push(action.actionFormatter(row, index, actionIndex, clickEventClass));
                } else {
                    htmlArray.push('<a class="result-action ' + clickEventClass + '" href="javascript:void(0)" title="' + action.title + '" app-tooltip>');
                    htmlArray.push('<i class="' + action.className + '"></i>');
                    htmlArray.push('</a>');
                }
            });
            htmlArray.push('</div>');
            return htmlArray.join('');
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('dyn.bootstrap-table')
        .service('DynBootstrapUtils', DynBootstrapUtils);

    DynBootstrapUtils.$inject = [];

    /* @ngInject */
    function DynBootstrapUtils() {
        this.createTableAction = createTableAction;

        /**
         * Template para a criação das actions da tabela.
         *
         * @param  {String} eventClass Class css a ser embutido no elemento.
         * @param  {String} title      Título para exibir no tooltip.
         * @param  {String} icon       Icone a ser exibido.
         * @return {String}            Html do icon a ser exibido na tabela.
         */
        function createTableAction(eventClass, title, icon) {
            var htmlArray = [];
            htmlArray.push('<a class="result-action ' + eventClass + '" href="javascript:void(0)" title="' + title + '" app-tooltip>');
            htmlArray.push('<i class="' + icon + '"></i>');
            htmlArray.push('</a>');
            return htmlArray.join('');
        }
    }
})();
