// @flow
import React from 'react'
import { AppBar, Toolbar, Typography } from 'material-ui'
import { DialogTitle } from 'material-ui/Dialog'
import { withStyles } from 'material-ui/styles'
import type { StatelessFunctionalComponent } from 'react'

export default withStyles({
  appBar: { position: 'relative' },
  dialogTitle: { display: 'flex', justifyContent: 'space-between' },
  header: { flex: 1 },
  subheading: { padding: '16px 24px 0' },
})(
  ({
    activeStep,
    classes: { appBar, dialogTitle, header, subheading },
    fullScreen,
    steps,
    subheadingAlign,
    subheadings,
    title,
  }: {
    activeStep: number,
    classes: {
      appBar: string,
      dialogTitle: string,
      header: string,
      subheading: string,
    },
    fullScreen: boolean,
    steps: number,
    subheadingAlign?: (activeStep: number) => 'left' | 'center' | 'right',
    subheadings: Array<string>,
    title: string,
  }) => {
    const Header: StatelessFunctionalComponent<*> = () => (
      <Typography
        color="inherit"
        className={header}
        gutterBottom
        noWrap
        type="title"
      >
        {title}
      </Typography>
    )

    const HeaderSteps: StatelessFunctionalComponent<*> = () => (
      <Typography color="inherit">{`Step ${activeStep +
        1} of ${steps}`}</Typography>
    )

    const SubHeading: StatelessFunctionalComponent<*> = () => (
      <Typography
        type="subheading"
        color="inherit"
        align={subheadingAlign && subheadingAlign(activeStep)}
      >
        {subheadings[activeStep]}
      </Typography>
    )

    return fullScreen ? (
      <div>
        <AppBar className={appBar}>
          <Toolbar>
            <Header />
            <HeaderSteps />
          </Toolbar>
        </AppBar>
        <div className={subheading}>
          <SubHeading />
        </div>
      </div>
    ) : (
      <DialogTitle disableTypography>
        <div className={dialogTitle}>
          <Header />
          <HeaderSteps />
        </div>
        <SubHeading />
      </DialogTitle>
    )
  },
)
