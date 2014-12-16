#include "../prototipo.h"
#include <stdio.h>
void test02() {
    int i, n = 0;
    for (i = 1000; i < 10000; ++i) {
        if (esVampiro(i))
        	++n;
    }
    printf("%d", n);
}