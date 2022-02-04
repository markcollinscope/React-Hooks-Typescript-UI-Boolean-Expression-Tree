"use strict";
/*
Ui Actions:
* Eval Button - enabled when Eval possible.
* Txt representation of expression shown.
* Start: undef-nodetype -> UI Select From Drop Down Menu -> Create Appropriate Subnode. Factory.
* AND, OR, BINOP => two undef subnodes.
* NOT => one undef subnode.
* Eval => recursive descent evaluation.
* Undef in Eval (anywhere) - whole expression is Undef.

Menu:
* On Undef nodes only.
* Callback deletes then recreates lhs, rhs ...

Delete:
* On Composite Nodes (UI) only.
* Replaces subnode with Undef.
* ... then: just normal.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.NO_EVAL_ERROR = exports.APP_ERROR = void 0;
// Abstraction of the concept of a valid boolean expression.
// Deals with creation and evalution of such expressions, including constants values, binary operations unary operations.
// This module does not deal with UI as it is part of the business logic of the application.
// It is, of course, used by the UI code to create, modify and evaluate the expressions contained herein.
var ERROR = 'error';
exports.APP_ERROR = Symbol(ERROR); // every calls to Symbol(ERROR) is guaranteed to return a UNIQUE symbol.
var AppError = /** @class */ (function () {
    function AppError(code, message) {
        var _this = this;
        if (code === void 0) { code = exports.APP_ERROR; }
        if (message === void 0) { message = "basic application programming error"; }
        this.code = function () { return _this.errCode; };
        this.msg = function () { return _this.message; };
        this.errCode = code;
        this.message = message;
    }
    return AppError;
}());
exports.NO_EVAL_ERROR = Symbol(ERROR);
var NoEvalError = /** @class */ (function (_super) {
    __extends(NoEvalError, _super);
    function NoEvalError(message) {
        if (message === void 0) { message = "cannot evaluate expression"; }
        return _super.call(this, exports.NO_EVAL_ERROR, message) || this;
    }
    return NoEvalError;
}(AppError));
var Boulangerie = /** @class */ (function () {
    function Boulangerie() {
        this.name = function () { throw new AppError(); };
        this.eval = function () { throw new AppError(); }; // TODO check never;
    }
    return Boulangerie;
}());
var UndefBoulangerie = /** @class */ (function (_super) {
    __extends(UndefBoulangerie, _super);
    function UndefBoulangerie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = function () {
            return 'Undef';
            eval = function () { throw NoEvalError(); };
        };
        return _this;
    }
    return UndefBoulangerie;
}(Boulangerie));
var ConstBoulangerie = /** @class */ (function (_super) {
    __extends(ConstBoulangerie, _super);
    function ConstBoulangerie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = undefined;
        _this.eval = function () { return _this.value; };
        _this.name = function () { return _this.value ? 'true' : 'false'; };
        return _this;
    }
    ConstBoulangerie.prototype.contructor = function (value) {
        this.value = value; // T, F or Undef.
    };
    return ConstBoulangerie;
}(Boulangerie));
Type;
UniOpType = 'NOT' | 'SAME';
var UniOpBoulangerie, Boulangerie;
{
    subType: UniOpType = undefined;
    subBoulangerie: Boulangerie = undefined; // ???
}
