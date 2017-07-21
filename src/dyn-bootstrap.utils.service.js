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
