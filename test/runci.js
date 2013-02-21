var originalExit = process.exit;
process.exit = function (statusCode) {
  if (statusCode === 0) {
    process.exit = originalExit;
    require('./runtests');
  } else {
    originalExit(statusCode);
  }
}

// Run jsHint first
require('./runjshint');