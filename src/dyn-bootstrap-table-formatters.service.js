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
