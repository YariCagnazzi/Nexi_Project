class CustomClass {
  static inputDefault = {};

  constructor() {
      this.inputVariables = CustomClass.inputDefault;
  }

  setInputVariables(value) {
      this.inputVariables = value;
  }

  getInputVariables() {
      return this.inputVariables;
  }

  static setInputDefault(value) {
      CustomClass.inputDefault = value;
  }

  static getDefault() {
      return CustomClass.inputDefault;
  }

  // Metodo per recuperare i valori di default salvati
  getInputDefault() {
      return CustomClass.inputDefault;
  }
}

module.exports = { CustomClass };