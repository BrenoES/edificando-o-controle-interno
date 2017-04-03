/** <pre>
 * build.mutua.ts
 * ==============
 * (created by luiz on Tue, Dec, 6, 2016)
 *
 * Applies the Mutua building mechanism to the project:
 *
 * 1) Builds .ts files to load modules on runtime
 * 2) Copies project files to their destinations -- Allowing fonts, images, icons and other theme files to be bundled along with the project.
 *
 * Integrated into the build process by the seed.tasks.json file.
 *
 * @see seed.tasks.json file
 * @author luiz
 */

import * as gulp from 'gulp';
import { relative, join } from 'path';
import BuildConfig from '../../config';

import { Config } from '../../../src/client/app/shared/core/utils/config';
import { DataManipulation } from '../../config/mutua.available.modules.and.components.config';
import { appTheme }         from '../../config/mutua.instance-project.config';

import * as merge from 'merge-stream';

export = () => {

  // run the code generation script (mutua. html and mobile .loading.config.ts)
  DataManipulation.generateSourceFiles('src/');     // this script is run having it's current folder set to the project's root, hence, we get to the 'src' directory directly

  let src: string[] = [];

  // include components and modules files (font files, for instance)
  if (Config.IS_MOBILE_NATIVE()) {
    //src.push(...DataManipulation.getActivatedModulesAndComponentsMobileFiles());    soon or later this function will have to be implemented...
  } else if (Config.IS_MOBILE_HYBRID()) {
    let errorMsg: string = `build.mutua.ts: don't know how to build to 'MOBILE_HIBRID'... please update this script.`;
    console.log(errorMsg);
    throw new Error(errorMsg);
  } else /* it is for either web or desktop */ {
    src.push(...DataManipulation.getActivatedModulesAndComponentsHTMLFiles(Config.IS_WEB(), Config.IS_DESKTOP()));
  }

  // copies modules and components declared files as well as theme files
  // please note this is not an elegant solution for themes, but it will do for now: we are copying themes/components/**/*.html and *.scss files back to the source tree, where
  // they used to belong to on the angular-seed-* projects (and the same for modules). For this reason, we had to add to .gitignore all *.html and *.scss files under
  // src/client/app/components and src/client/app/shared/modules. This way, we didn't have to mess with the original 'build.html_css.ts', that would elegantly solve the metter.
  return merge(

    // copy the files modules and components declare they want to copy
    gulp.src(src, { base: './' } )
      .pipe(gulp.dest(join(BuildConfig.APP_DEST))),

    // copy the theme files -- components *.html and *.scss
    gulp.src([`themes/${appTheme}/components/**/*`], { base: `themes/${appTheme}`})
      .pipe(gulp.dest(join('src/client/app'))),

    // copy the theme files -- modules *.html and *.scss
    gulp.src([`themes/${appTheme}/modules/**/*`], { base: `themes/${appTheme}`})
      .pipe(gulp.dest(join('src/client/app/shared'))),

    // copy the theme files -- assets -- this one is copied to the right place: the dist folder (unlike the other two above)
    gulp.src([`themes/${appTheme}/assets/**/*`], { base: `themes/${appTheme}`})
        .pipe(gulp.dest(join(BuildConfig.APP_DEST))),
  );

/*
  return gulp.src([`themes/${appTheme}/components/!**!/!*`], { base: `themes/${appTheme}`})
    .pipe(gulp.dest(join(BuildConfig.APP_DEST + '/app')));
*/

};
