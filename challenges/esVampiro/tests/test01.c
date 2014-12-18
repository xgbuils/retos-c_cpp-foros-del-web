#include "../prototipo.h"
#include <stdio.h>

int main(void) {
    int i, n = 0;
    for (i = 100000; i < 1000000; ++i) {
        if (esVampiro(i))
        	++n;
    }
    printf("%d", n);
    return 0;
}