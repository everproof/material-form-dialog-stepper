import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.jsx',
  output: { name: 'material-form-dialog-stepper' },
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs({
      namedExports: {
        'node_modules/material-ui/styles/index.js': ['withStyles'],
      },
    }),
    babel({ exclude: 'node_modules/**', plugins: ['external-helpers'] }),
  ],
  external: [
    'material-ui',
    'material-ui/Dialog',
    'material-ui/MobileStepper',
    'material-ui/styles',
    'material-ui/transitions/Slide',
    'material-ui-icons',
    'react',
    'react-redux',
    'redux-form',
  ],
  globals: {
    'material-ui': 'MaterialUI',
    'material-ui/Dialog': 'Dialog',
    'material-ui/MobileStepper': 'MobileStepper',
    'material-ui/styles': 'styles',
    'material-ui/transitions/Slide': 'Slide',
    'material-ui-icons': 'MaterialUiIcons',
    react: 'React',
    'react-redux': 'ReactRedux',
    'redux-form': 'ReduxForm',
  },
}
