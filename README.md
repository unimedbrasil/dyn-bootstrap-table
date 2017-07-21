### Dynamix Boostrap Table - Serviço para auxiliar na criação e manipulação do [Bootstrap Table](https://github.com/wenzhixin/bootstrap-table)

### Links rápidos
- [Instalação](#instalacao)
    - [Bower](#instalar-com-o-bower)
    - [Manual](#download-manual)
- [Demo](#demo)

# Instalação

É necessário ter o [Bootstrap Table](bootstrap-table) instalado, sendo que o mesmo está incluso como dependencia desse projeto.
    - Também é necessário importar os plungs 'mobile' e 'angular'

## Requisitos do Bootstrap Table
* dyn-bootstrap-table foi testado com o bootstrap-table 1.10.0.

#### Instalar com o Bower
```sh
$ bower install dyn-bootstrap-table=git@git.dynamix.com.br:angular/dyn-bootstrap-table.git
```

#### Download manual

Após instalar todas as dependencias, todos os arquivos desta lib encontram-se aqui:
http://git.dynamix.com.br/angular/dyn-bootstrap-table/tree/master/dist

### Adicionando a dependência no seu projeto

Quando você baixar todas as dependências e incluí-las no seu projeto, você poderá usá-la incluindo o módulo `dyn.bootstrap-table`:

```js
angular.module('myModule', ['dyn.bootstrap-table']);
```

# Demo

Essa lib auxilia na criação da bootstrap-table. Primeiramente o elemento da tabela deve ser inserido na página e referenciar a propriedade do seu controller que será gerada pelo `dyn.bootstrap-table`, no caso deste exemplo é o atributo `resultTable`.

```html
<table id="myTable" bs-table-control="myCtrl.resultTable"></table>
```

No seu controller importe o serviço `DynBootstrapTable` e opcionalmente o helper para formatação de campos `DynBootstrapTableFormatters`.

```js

MyController.$inject = ['DynBootstrapTable','DynBootstrapTableFormatters'];

function initMyDataTable() {

    var _this = this;
    var myTableService = DynBootstrapTable().init('#myTable');

    // Define a função de consulta dos dados.
    // Deverá ser passado para a tabela um objeto na estrutura
    // { total: 12, rows: [ {...}, {...}, {...}, ... ] }
    myTableService.setFetchFunction(function(params, successCallback, errorCallback) {
        MyBusinessService.getListOfValues(params)
            .then(function(response) {
                successCallback(response);
            })
            .catch(function(error) {
                errorCallback(error);
            });
    });

    // Define a função que retorna os filtros da consulta caso exista um form de dados.
    // Os parametros do form serão passados juntamente com os valores de
    // paginação (limit, offset) para o parâmetro params no método setFetchFunction.
    myTableService.setFetchParametersFunction(function() {
        return _this.myFormFilter;
    });

    // Definição das colunas
    var column = myTableService.addColumn('name', 'Nome');

    // Definição das colunas
    column = myTableService.addColumn('dtImport', 'Data Importação');
    column.setFormatter(DynBootstrapTableFormatters.getDateFormatter('YYYY-MM-DDTHH:mm', 'DD/MM/YYYY | HH:mm:ss'));

    // Definição das colunas
    column = myTableService.addColumn('fileName', 'Arquivo');

    // Coluna com icone de ação
    column = myTableService.addColumn('actions', 'Ações');
    column.setAlign('center');
    column.addAction('fa fa-eye', 'Abrir', function(index, row, actionIndex) {
        // Executa ação ao clicar no icone
    });

    // Cria a as configurações da bootstrap-table.
    _this.resultTable = myTableService.create();
}
```

## Deploy
bower register dyn-bootstrap-table {{repositorio git}}
