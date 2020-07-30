function print (...content) {
    for (const value of content) process.stdout.write(value + ' ')
    process.stdout.write('\n')
}