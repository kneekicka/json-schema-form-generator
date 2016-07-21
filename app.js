angular.module('formsApp', [])
.controller('FormsController', function ($scope, $http, $compile) {

    var mv = this;

    $http.get('data/form.json')
        .success(function(response){
            mv.formData = response;
            var formContents = processSchema(mv.formData);
            angular.element(document.querySelector("#form")).append(formContents);
            $compile(angular.element(formContents).contents())($scope);

            document.querySelector("#form").innerHTML += '<input type="submit" value="Submit" class="btn btn-primary pull-right">';
        })
        .error(function(response) {
            console.log('Error reading json: ', response);
        });

    $scope.submitForm = function(isValid) {

        // check to make sure that the form is valid
        if (isValid) {
            alert('Form is valid');
        }

    };

    var processSchema = function(json, name) {
        var resultNode = null;

        switch(json.type) {
            case 'string':
                resultNode = inputBlock(json, name, 'text');
                break;
            case 'integer':
            case 'number':
                resultNode = inputBlock(json, name, 'number');
                break;
            case 'object':
                resultNode = formBlock(json, name);
                break;
            case 'boolean':
                resultNode = booleanBlock(json, name);
                break;
            default :
                resultNode = document.createElement('span');
                break;
        }

        return resultNode;
    };


    var formBlock = function(data, label) {
        var node = document.createElement('div');
        node.setAttribute('class', 'panel panel-default');

        var head = document.createElement('div');
        head.setAttribute('class', 'panel-heading');
        head.innerHTML = label;
        var body = document.createElement('div');
        body.setAttribute('class', 'panel-body');

        var properties = Object.keys(data.properties);
        properties.forEach(function (item) {
            body.appendChild(processSchema(data.properties[item], item));
        });

        node.appendChild(head);
        node.appendChild(body);

        if(!label) {
            return body;
        }

        return node;
    };

    var errorSpan = function(model, conditions, messages) {
        var span = document.createElement('span');

        span.setAttribute('style', 'color:red');
        span.setAttribute('ng-show', model + '.$dirty && ' + model + '.$invalid');

        conditions.forEach(function (condition, index) {
            var subSpan = document.createElement('span');
            subSpan.setAttribute('ng-show', model + '.$error.' + condition);
            subSpan.innerHTML = messages[index];
            span.appendChild(subSpan);
        });


        return span;
    };

    var inputBlock = function(data, label, type) {
        var node = document.createElement('div');
        node.setAttribute('class', 'form-group');

        var labelNode = document.createElement('label');
        labelNode.setAttribute('class', 'control-label col-sm-2');
        labelNode.setAttribute('for', label);
        labelNode.innerHTML = data.title ? data.title : label;
        var subDiv = document.createElement('div');
        subDiv.setAttribute('class', 'col-sm-10');

        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('class', 'form-control');
        input.setAttribute('id', label);
        input.setAttribute('ng-model', 'ctrl.' + label);
        input.setAttribute('name', label);
        input.setAttribute('placeholder', 'Enter ' + label);
        subDiv.appendChild(input);

        var conditions = [];
        var messages = [];

        if(data.pattern) {
            input.setAttribute('pattern', data.pattern);
            conditions.push('pattern');
            messages.push('Field doesn\'t match pattern');
        }

        if(data.maxLength) {
            input.setAttribute('maxlength', data.maxLength);
            conditions.push('maxlength');
            messages.push('Field is too long');
        }

        if(data.minLength) {
            input.setAttribute('minlength', data.minLength);
            conditions.push('minlength');
            messages.push('Field is too short');
        }

        node.appendChild(labelNode);
        node.appendChild(subDiv);

        return node;
    };


    var booleanBlock = function(data, label) {
        var node = document.createElement('div');

        node.setAttribute('class', 'col-sm-offset-2 col-sm-10');


        var subDiv = document.createElement('div');
        subDiv.setAttribute('class', 'checkbox');


        var labelNode = document.createElement('label');

        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', label);

        labelNode.appendChild(input);
        subDiv.appendChild(labelNode);
        node.appendChild(subDiv);
        return node;
    };
});