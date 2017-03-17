/*******************************************************************************
 * Copyright (c) 2012-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 *******************************************************************************/
package org.eclipse.che.api.vfs.impl.memory;

import org.eclipse.che.api.core.ServerException;
import org.eclipse.che.api.vfs.AbstractVirtualFileSystemProvider;
import org.eclipse.che.api.vfs.ArchiverFactory;
import org.eclipse.che.api.vfs.VirtualFile;
import org.eclipse.che.api.vfs.VirtualFileSystem;
import org.eclipse.che.api.vfs.search.Searcher;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory implementation of VirtualFileSystem.
 * <p/>
 * NOTE: This implementation is not thread safe.
 *
 * @author andrew00x
 */
public class MemoryVirtualFileSystem implements VirtualFileSystem {
    private static final AtomicInteger ID = new AtomicInteger();

    private final ArchiverFactory                                 archiverFactory;
    private final AbstractVirtualFileSystemProvider.CloseCallback closeCallback;
    private final int id = ID.incrementAndGet();

    private VirtualFile root;

    public MemoryVirtualFileSystem(ArchiverFactory archiverFactory) {
        this(archiverFactory, null);
    }

    MemoryVirtualFileSystem(ArchiverFactory archiverFactory, AbstractVirtualFileSystemProvider.CloseCallback closeCallback) {
        this.archiverFactory = archiverFactory;
        this.closeCallback = closeCallback;
        root = new MemoryVirtualFile(this);
    }

    @Override
    public VirtualFile getRoot() {
        return root;
    }

    @Override
    public void close() throws ServerException {
        root = null;
        if (closeCallback != null) {
            closeCallback.onClose();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if ((o instanceof MemoryVirtualFileSystem)) {
            MemoryVirtualFileSystem other = (MemoryVirtualFileSystem)o;
            return id == other.id;
        }
        return false;

    }

    @Override
    public int hashCode() {
        return id;
    }

    ArchiverFactory getArchiverFactory() {
        return archiverFactory;
    }
}
