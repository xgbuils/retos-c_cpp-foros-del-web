#include "../prototipo.h"
#include <stdio.h>

int main (void) {
    int i, n = 0;
    for (i = 10000000; i < 10100000; ++i) {
        if (esVampiro(i))
        	++n;
    }
    printf("%d", n);
    return 0;
}