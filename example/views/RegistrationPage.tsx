import {
  FormDefinition, FormStepDefinition, FormFieldDefinition,
  FormValidationStyle, FormError,
} from "offside-app-container"
import React from "react"
import ReactDOM from "react-dom"
import {
  ExampleAppProps, ExampleAppState, UIChromeData,
  ExampleAppActions
} from "../ExampleAppData"

const FORM_KEY = "registration"
const STEP_KEY = "default"

export default class RegistrationPage extends React.Component<ExampleAppProps, any> {
  static preLoad (state: ExampleAppState, actions: ExampleAppActions) {
    actions.forms.init(FORM_KEY)
    return Promise.resolve(true)
  }

  constructor (props, context) {
    super(props, context)
    this.updateField = this.updateField.bind(this)
    this.blurField = this.blurField.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  updateField (e) {
    const {actions} = this.props
    actions.forms.updateField(FORM_KEY, STEP_KEY, e.target.name, e.target.value)
  }

  blurField (e) {
    const {actions} = this.props
    actions.forms.blurField(FORM_KEY, STEP_KEY, e.target.name)
  }

  submitForm (e) {
    e.preventDefault()
    const {actions} = this.props
    actions.forms.submitStep(FORM_KEY, STEP_KEY).then((data) => {
      console.log(data, 'submit form')
    }, (errors) => {
      console.log(errors, 'error')
    })
  }

  render () {
    const {l10n, routes, forms, businessData, actions} = this.props
    const formData = forms[FORM_KEY].steps[STEP_KEY].data
    const errorData = forms[FORM_KEY].steps[STEP_KEY].errors
    const warnData = forms[FORM_KEY].steps[STEP_KEY].warnings
    const t_ = l10n.translate

    console.log(errorData)

    return <form onSubmit={this.submitForm} className="HomePage">
      <h1>{t_('registration')}</h1>

      <label htmlFor="username">
        {t_("username")} <br />
        <input onChange={this.updateField}
               onBlur={this.blurField}
               id="username"
               name="username" value={formData.username} />
        {(errorData.username.length > 0) && <p
          className="error"
        >{errorData.username.join(' ')}</p>}
      </label>

      <br /><br />

      <label htmlFor="email">
        {t_("email")} <br />
        <input onChange={this.updateField}
               onBlur={this.blurField}
               id="email" type="email"
               name="email" value={formData.email} />
        {(errorData.email.length > 0) && <p
          className="error"
        >{errorData.email.join(' ')}</p>}
      </label>

      <br /><br />

      <label htmlFor="password">
        {t_("password")} <br />
        <input onChange={this.updateField}
               onBlur={this.blurField}
               id="password"
               type="password"
               name="password" value={formData.password} />
        {(errorData.password.length > 0) && <p
          className="error"
        >{errorData.password.join(' ')}</p>}
      </label>

      <br /><br />

      <label htmlFor="magicword">
        {t_("magicword")} <br />
        <input onChange={this.updateField}
               onBlur={this.blurField}
               id="magicword"
               type="text"
               name="magicword" value={formData.magicword} />
        {(errorData.magicword.length > 0) && <p
          className="error"
        >{errorData.magicword.join(' ')}</p>}
      </label>

      <br /><br />

      <button type="submit">{t_('submit_user')}</button>

    </form>
  }
}


export const RegistrationForm = new FormDefinition("registration")
const registrationStep = new FormStepDefinition(STEP_KEY)

function magicWordProvided (
  value: any,
  formState: FormState
): Promise<boolean> {
  console.log('magic word check', value)
  if (value != "please") {
    return Promise.reject(new FormError("You didn't say the magic word."))
  }

  return Promise.resolve(true)
}

RegistrationForm.addStep(STEP_KEY, registrationStep)
registrationStep.addField("username", new FormFieldDefinition("text", true, FormValidationStyle.OnBlur))
registrationStep.addField("email", new FormFieldDefinition("email", true, FormValidationStyle.WhileEditing))
registrationStep.addField("password", new FormFieldDefinition("password", true, FormValidationStyle.WhileEditing))
registrationStep.addField(
  "magicword",
  new FormFieldDefinition("magicword", true, FormValidationStyle.OnStepEnd, [
  magicWordProvided
  ])
)
